import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { CommentLike } from '../like/entities/comment-like.entity';
import { Post } from '../post/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(private readonly dataSource: DataSource) {}

  async create({ content, postId, commenterId }: CreateCommentDto) {
    const commentRepo = this.dataSource.getRepository(Comment);
    const postRepo = this.dataSource.getRepository(Post);
    const post = await postRepo.findOneByOrFail({ id: postId });
    const comment = commentRepo.create({ post, content, commenterId });
    await commentRepo.save(comment);
    return comment;
  }
  async createChild(id: number, dto: CreateCommentDto) {
    const commentRepo = this.dataSource.getRepository(Comment);

    const comment = await commentRepo.findOneBy({ id });

    const child = commentRepo.create(dto);
    child.parentComment = comment;

    return commentRepo.save(child);
  }

  async findAll(likerId: number, postId: number) {
    const commentRepo = this.dataSource.getRepository(Comment);
    const total = await commentRepo.countBy({ postId });
    const comments = await commentRepo
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.commenter', 'commenter')
      .leftJoinAndSelect('commenter.career', 'career')
      .leftJoinAndSelect('career.job', 'job')
      .leftJoinAndSelect('comment.childComments', 'childComments')
      .leftJoinAndSelect('childComments.commenter', 'childCommenter')
      .loadRelationCountAndMap('comment.totalLikes', 'comment.likes')
      .loadRelationCountAndMap(
        'childComments.totalLikes',
        'childComments.likes',
      )
      .loadRelationCountAndMap(
        'comment.liked',
        'comment.likes',
        'commentLikes',
        (qb) => qb.where('commentLikes.likerId =:likerId', { likerId }),
      )
      .loadRelationCountAndMap(
        'childComments.liked',
        'childComments.likes',
        'childCommentLikes',
        (qb) => qb.where('childCommentLikes.likerId =:likerId', { likerId }),
      )
      .where('comment.postId =:postId', { postId })
      .andWhere('comment.parentCommentId IS NULL')
      .orderBy('comment.id', 'DESC')
      .getMany();
    return { total, comments };
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: number, commenterId: number) {
    const repo = this.dataSource.getRepository(Comment);
    const comment = await repo.findOne({
      where: { id, commenterId },
      relations: { childComments: true },
    });

    if (!comment) throw new NotFoundException();

    return repo.softRemove(comment);
  }
}

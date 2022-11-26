import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
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

  async findAll(postId: number) {
    const commentRepo = this.dataSource.getRepository(Comment);
    const total = await commentRepo.countBy({ postId });
    const comments = await commentRepo.find({
      where: { postId, parentCommentId: IsNull() },
      relations: { commenter: true, childComments: { commenter: true } },
      order: { id: 'desc' },
    });
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
    const comment = await repo.findOneBy({ id, commenterId });

    if (!comment) throw new NotFoundException();

    return repo.softRemove(comment);
  }
}

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(private readonly dataSource: DataSource) {}

  async create({ content, postId, userId }: CreateCommentDto) {
    const commentRepo = this.dataSource.getRepository(Comment);
    const postRepo = this.dataSource.getRepository(Post);
    const post = await postRepo.findOneByOrFail({ id: postId });
    const comment = commentRepo.create({ post, content, userId });
    await commentRepo.save(comment);
    return comment;
  }

  findAll(postId: number) {
    const commentRepo = this.dataSource.getRepository(Comment);
    return commentRepo.find({
      where: { postId },
      relations: { user: true },
      order: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}

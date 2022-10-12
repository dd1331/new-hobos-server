import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { PagingDTO } from '../common/paging.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostCategory } from './entities/post-category.entity';
import { Post } from './entities/post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly dataSource: DataSource,
  ) {}
  async post(dto: CreatePostDto) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const { categoryId } = dto;

      const post = manager.create(Post, dto);
      await manager.save(post);
      const postCategory = manager.create(PostCategory, {
        post,
        categoryId,
      });

      await manager.save(postCategory);

      return post;
    });
  }

  getList(categoryId: number, dto: PagingDTO) {
    return this.postRepo.getList(this.dataSource.manager, categoryId, dto);
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

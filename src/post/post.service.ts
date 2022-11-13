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
      const { categoryIds } = dto;

      const post = manager.create(Post, dto);
      await manager.save(post);
      const postCategories = categoryIds.map((categoryId) =>
        manager.create(PostCategory, {
          post,
          categoryId,
        }),
      );

      await manager.save(postCategories);

      return post;
    });
  }

  getList(dto: PagingDTO) {
    return this.postRepo.getList(this.dataSource.manager, dto);
  }
  getListByCategory(categoryId: number, dto: PagingDTO) {
    return this.postRepo.getListByCategory(
      this.dataSource.manager,
      categoryId,
      dto,
    );
  }

  async update({ postId, categoryIds, content, title, userId }: UpdatePostDto) {
    const post = await this.postRepo.findOneOrFail({
      where: { id: postId, userId },
    });

    const categories = await this.dataSource.manager.save(
      PostCategory,
      categoryIds.map((categoryId) => ({ categoryId, postId })),
    );

    post.update({ title, content, categories });

    return this.postRepo.save(post);
  }

  async remove({ userId, id }: { userId: number; id: number }) {
    const found = await this.postRepo.findOneByOrFail({ userId, id });
    return this.postRepo.softRemove(found);
  }
}

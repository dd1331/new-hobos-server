import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { PagingDTO } from '../common/paging.dto';
import { PostLike } from '../like/entities/post-like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileEntity } from './entities/file.entity';
import { PostCategory } from './entities/post-category.entity';
import { PostFile } from './entities/post-file.entity';
import { Post } from './entities/post.entity';
import { TestDTO } from './post.controller';
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
      post.files = dto.fileUrls.map((url) => {
        const file = manager.create(FileEntity, { url });
        return manager.create(PostFile, { file });
      });
      // TODO: map dto.fileUrls to post entity
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

  // TODO: transaction
  async getPostViewAndRead(likerId: number, id: number) {
    await this.postRepo.increment({ id }, 'views', 1);
    return this.getPostView(likerId, id);
  }
  async getPostView(likerId: number | null, postId: number) {
    const liked = await this.dataSource
      .getRepository(PostLike)
      .countBy({ likerId, postId });
    const post = await this.postRepo
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.poster', 'poster')
      .leftJoinAndSelect('poster.career', 'career')
      .leftJoinAndSelect('career.job', 'job')
      .leftJoinAndSelect('post.files', 'files')
      .leftJoinAndSelect('files.file', 'file')
      .loadRelationCountAndMap('post.totalLikes', 'post.likes')
      .where('post.id =:postId', { postId })
      .getOne();
    return { liked: !!liked, post };
  }
  getList(dto: PagingDTO) {
    return this.postRepo.getList(this.dataSource.manager, dto);
  }
  async getHomeList(dto: TestDTO) {
    const categories = await this.dataSource
      .getRepository(Category)
      .findBy({ id: In(dto.categoryIds) });

    const promises = categories.map(async (category) => {
      // dto.categoryId = category.id as number;
      const posts = await this.postRepo.getListByCategory(dto, category.id);
      return { posts, category };
    });

    const posts = await Promise.all(promises);

    return posts;
  }
  getListByCategory(dto: PagingDTO & { categoryId: number }) {
    return this.postRepo.getListByCategory(dto, dto.categoryId);
  }

  async update({
    postId,
    categoryIds,
    content,
    title,
    posterId,
  }: UpdatePostDto) {
    const post = await this.postRepo.findOneOrFail({
      where: { id: postId, posterId },
    });

    const categories = await this.dataSource.manager.save(
      PostCategory,
      categoryIds.map((categoryId) => ({ categoryId, postId })),
    );

    post.update({ title, content, categories });

    return this.postRepo.save(post);
  }

  async remove({ posterId, id }: { posterId: number; id: number }) {
    const found = await this.postRepo.findOneByOrFail({ posterId, id });
    return this.postRepo.softRemove(found);
  }
}

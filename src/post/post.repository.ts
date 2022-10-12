import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PagingDTO } from '../common/paging.dto';
import { PostCategory } from './entities/post-category.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  getList(
    manager: EntityManager,
    categoryId: number,
    { take, skip }: PagingDTO,
  ) {
    return manager.find(PostCategory, {
      where: { categoryId },
      relations: { post: true },
      take,
      skip,
    });
  }
}

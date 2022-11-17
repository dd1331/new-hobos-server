import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PagingDTO } from '../common/paging.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  getList(manager: EntityManager, { take, skip }: PagingDTO) {
    return manager.find(Post, {
      relations: { categories: true },
      take,
      skip,
      order: { id: 'desc' },
    });
  }
  getListByCategory({ take, skip }: PagingDTO, categoryId: number) {
    return this.find({
      where: { categories: { categoryId } },
      relations: { categories: true },
      take,
      skip,
    });
  }
}

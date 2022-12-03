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
      relations: { categories: true, poster: true },
      take,
      skip,
      order: { id: 'desc' },
    });
  }
  getListByCategory({ take, skip }: PagingDTO, categoryId: number) {
    return this.createQueryBuilder('post')
      .innerJoinAndSelect('post.categories', 'category')
      .innerJoinAndSelect('post.poster', 'poster')
      .leftJoinAndSelect('poster.career', 'career')
      .leftJoinAndSelect('career.job', 'job')
      .loadRelationCountAndMap('post.totalComments', 'post.comments')
      .loadRelationCountAndMap('post.totalLikes', 'post.likes')
      .where('category.categoryId =:categoryId', { categoryId })
      .take(take)
      .skip(skip)
      .orderBy('post.id', 'DESC')
      .getMany();
  }
}

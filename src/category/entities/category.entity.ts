import {
  Column,
  Entity,
  ManyToOne, Tree,
  TreeChildren,
  TreeParent
} from 'typeorm';
import { Common } from '../../common/common.entity';
import { PostCategory } from '../../post/entities/post-category.entity';

@Entity()
@Tree('materialized-path')
export class Category extends Common {
  @Column()
  title: string;

  @ManyToOne(() => PostCategory)
  postCategory: PostCategory;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;
}

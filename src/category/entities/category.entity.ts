import {
  Column,
  Entity,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Common } from '../../common/common.entity';
import { PostCategory } from '../../post/entities/post-category.entity';

enum View {
  NORMAl = 'NORMAL',
  SIMPLE = 'SIMPLE',
  FANCY = 'FANCY',
}
@Entity()
@Tree('materialized-path')
export class Category extends Common {
  @Column()
  title: string;

  @Column({ type: 'enum', enum: View, default: View.FANCY })
  view: View;

  @ManyToOne(() => PostCategory)
  postCategory: PostCategory;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;
}

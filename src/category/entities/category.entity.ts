import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	Tree,
	TreeChildren,
	TreeParent
} from 'typeorm';
import { Common } from '../../common/common.entity';
import { PostCategory } from '../../post/entities/post-category.entity';

@Entity()
@Tree('nested-set')
export class Category extends Common {
  @Column()
  title: string;

  @ManyToOne(() => PostCategory)
  @JoinColumn({ name: 'user_id' })
  postCategory: PostCategory;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;
}

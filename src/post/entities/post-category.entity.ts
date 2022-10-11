import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Common } from '../../common/common.entity';
import { Post } from './post.entity';

@Entity()
export class PostCategory extends Common {
  @Column({ name: 'post_id' })
  postId: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

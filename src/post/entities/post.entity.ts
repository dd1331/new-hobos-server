import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Common } from '../../common/common.entity';
import { User } from '../../user/entities/user.entity';
import { PostCategory } from './post-category.entity';

@Entity()
export class Post extends Common {
  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PostCategory, (postCategory) => postCategory.post, {
    cascade: true,
  })
  categories: PostCategory[];

  update({
    title,
    content,
    categories,
  }: {
    title: string;
    content: string;
    categories: PostCategory[];
  }) {
    this.title = title;
    this.content = content;
    this.categories = categories;
  }
}

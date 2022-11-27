import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { Common } from '../../common/common.entity';
import { PostLike } from '../../like/entities/post-like.entity';
import { User } from '../../user/entities/user.entity';
import { PostCategory } from './post-category.entity';

@Entity()
export class Post extends Common {
  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  views: number;

  @Column({ name: 'poster_id' })
  posterId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'poster_id' })
  poster: User;

  @OneToMany(() => PostCategory, ({ post }) => post, {
    cascade: true,
  })
  categories: PostCategory[];

  @OneToMany(() => Comment, ({ post }) => post)
  comments: Comment[];

  @OneToMany(() => PostLike, ({ post }) => post)
  likes: PostLike[];

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

import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from '../../common/common.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Comment extends Common {
  @Column()
  content: string;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @ManyToOne(() => Post)
  post: Post;
}

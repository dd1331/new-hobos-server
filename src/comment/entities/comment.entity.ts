import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from '../../common/common.entity';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Comment extends Common {
  @Column()
  content: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

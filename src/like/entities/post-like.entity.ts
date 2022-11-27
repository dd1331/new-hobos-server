import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from '../../common/common.entity';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class PostLike extends Common {
  @Column({ name: 'liker_id' })
  likerId: number;
  @Column({ name: 'post_id' })
  postId: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'liker_id' })
  liker: User;
  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;
}

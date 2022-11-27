import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { Common } from '../../common/common.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class CommentLike extends Common {
  @Column({ name: 'liker_id' })
  likerId: number;

  @Column({ name: 'comment_id' })
  commentId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'liker_id' })
  liker: User;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}

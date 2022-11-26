import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Common } from '../../common/common.entity';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Comment extends Common {
  @Column('text')
  content: string;

  @Column({ name: 'commenter_id' })
  commenterId: number;

  @Column({ name: 'post_id' })
  postId: number;

  @Column({ name: 'parent_comment_id', nullable: true })
  parentCommentId: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'commenter_id' })
  commenter: User;

  @ManyToOne(() => Comment, ({ childComments }) => childComments)
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: Comment;

  @OneToMany(() => Comment, ({ parentComment }) => parentComment)
  childComments: Comment[];
}

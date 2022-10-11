import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from '../../common/common.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Post extends Common {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  category: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

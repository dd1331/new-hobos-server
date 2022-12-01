import { Column, Entity } from 'typeorm';
import { Common } from '../../common/common.entity';
import { Career } from './career';

@Entity()
export class User extends Common {
  @Column()
  email: string;
  @Column()
  nickname: string;
  @Column()
  password: string;

  @Column(() => Career, { prefix: false })
  career: Career;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string | null;

  login(refreshToken) {
    this.refreshToken = refreshToken;
  }
}

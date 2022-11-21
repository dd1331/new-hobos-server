import { Column, Entity } from 'typeorm';
import { Common } from '../../common/common.entity';

@Entity()
export class User extends Common {
  @Column()
  email: string;
  @Column()
  nickname: string;
  @Column()
  password: string;
  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string | null;

  login(refreshToken) {
    this.refreshToken = refreshToken;
  }
}

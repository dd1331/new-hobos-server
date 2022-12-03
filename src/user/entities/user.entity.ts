import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Common } from '../../common/common.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Career } from './career';
import { Job } from './job.entity';

@Entity()
export class User extends Common {
  @Column()
  email: string;
  @Column()
  nickname: string;
  @Column()
  password: string;

  // @Column(() => Career, { prefix: false })
  // career: Career;

  @OneToOne(() => Career, {
    cascade: true,
  })
  @JoinColumn()
  career: Career;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string | null;

  login(refreshToken) {
    this.refreshToken = refreshToken;
  }
  update({ nickname, career }: UpdateUserDto & { career: Career }) {
    this.nickname = nickname;
    this.career = career;
  }
}

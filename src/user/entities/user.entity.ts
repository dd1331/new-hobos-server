import { BadRequestException } from '@nestjs/common';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Common } from '../../common/common.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Career } from './career';

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

  // TODO: 암호화 비교 / 회원가입시 엔티티에서 암호화
  comparePassword(inputPassword: string) {
    if (this.password !== inputPassword)
      throw new BadRequestException('비밀번호 일치하지 않음');
  }

  login(refreshToken) {
    this.refreshToken = refreshToken;
  }
  update({ nickname, career }: UpdateUserDto & { career: Career }) {
    this.nickname = nickname;
    this.career = career;
  }
}

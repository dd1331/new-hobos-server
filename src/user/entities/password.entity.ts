import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Column } from 'typeorm';

export class Password {
  @Column()
  private crypted: string;

  async setPassword(password: string) {
    const crypted = await this.hashPassword(password);
    this.crypted = crypted;
  }

  private hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  // TODO: 암호화 비교 / 회원가입시 엔티티에서 암호화
  async comparePassword(inputPassword: string) {
    const res = await bcrypt.compare(inputPassword, this.crypted);
    if (!res) throw new BadRequestException('비밀번호 일치하지 않음');
    return res;
  }
}

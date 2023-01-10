import { JwtService } from '@nestjs/jwt';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { JWT } from '../../auth/auth.constant';
import { Tokens } from '../../auth/auth.types';
import { Common } from '../../common/common.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Career } from './career';
import { Password } from './password.entity';

export enum AuthProvider {
  LOCAL,
  NAVER,
  KAKAO,
}
@Entity()
export class User extends Common {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column(() => Password, { prefix: false })
  private _password: Password;

  @OneToOne(() => Career, {
    cascade: true,
  })
  @JoinColumn()
  career: Career;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  ssoId: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
  provider: AuthProvider;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string | null;

  async signup(password: string) {
    await this._password.setPassword(password);
  }

  set password(password: Password) {
    this._password = password;
  }
  get password() {
    return this._password;
  }

  login(jwtService: JwtService): Tokens {
    const tokens = this.generateTokens(jwtService);

    this.refreshToken = tokens.refreshToken;

    return tokens;
  }
  update({ nickname, career }: UpdateUserDto & { career: Career }) {
    this.nickname = nickname;
    this.career = career;
  }
  private generateTokens(jwtService: JwtService): Tokens {
    const payload = { email: this.email, id: this.id };
    const accessToken = jwtService.sign(payload, {
      secret: JWT.SECRET,
      expiresIn: '1d',
    });
    const refreshToken = jwtService.sign(payload, {
      secret: JWT.SECRET + 2,
      expiresIn: '1d',
    });
    return { accessToken, refreshToken };
  }
}

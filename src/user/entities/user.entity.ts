import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Common } from '../../common/common.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Career } from './career';
import { Password } from './password.entity';

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

  @Column()
  image: string;

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

  login(refreshToken) {
    this.refreshToken = refreshToken;
  }
  update({ nickname, career }: UpdateUserDto & { career: Career }) {
    this.nickname = nickname;
    this.career = career;
  }
}

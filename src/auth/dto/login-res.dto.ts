import { User } from '../../user/entities/user.entity';

export class LoginResDto {
  tokens: { accessToken: string; refreshToken: string };
  user: User;
}

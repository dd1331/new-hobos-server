import { User } from '../../user/entities/user.entity';
import { Tokens } from '../auth.types';

export class LoginResDto {
  tokens: Tokens;
  user: User;
}

import { User } from '../user/entities/user.entity';
import { LoginLocalDto } from './dto/login-local.dto';
import { LoginResDto } from './dto/login-res.dto';

export interface AuthService {
  validateUser: (
    email: string,
    pass: string,
  ) => Promise<null | Omit<User, 'password'>>;
  loginLocal: (dto: LoginLocalDto) => Promise<LoginResDto>;
}

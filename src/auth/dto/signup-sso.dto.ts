import { SignupDTO } from '../../user/dto/signup.dto';
import { AuthProvider } from '../../user/entities/user.entity';

export class SignupSSODTO extends SignupDTO {
  ssoId: string;
  provider: AuthProvider;
}

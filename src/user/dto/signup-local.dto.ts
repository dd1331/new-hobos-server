import { MinLength } from 'class-validator';
import { SignupDTO } from './signup.dto';

export class SignupLocalDTO extends SignupDTO {
  @MinLength(8)
  password: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class SignupDTO extends PartialType(User) {
  email: string;
}

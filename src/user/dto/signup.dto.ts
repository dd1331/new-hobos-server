import { PickType } from '@nestjs/mapped-types';
import { IsEmail } from 'class-validator';
import { User } from '../entities/user.entity';

export class SignupDTO extends PickType(User, ['email']) {
  @IsEmail()
  email: string;
}

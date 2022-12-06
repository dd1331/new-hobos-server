import { PartialType } from '@nestjs/mapped-types';
import { IsEmail } from 'class-validator';
import { User } from '../entities/user.entity';

export class SignupDTO extends PartialType(User) {
  @IsEmail()
  email: string;
}

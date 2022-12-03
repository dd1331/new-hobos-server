import { PartialType } from '@nestjs/mapped-types';
import { SignupLocalDTO } from './signup-local.dto';
export class UpdateUserDto extends PartialType(SignupLocalDTO) {
  jobId: number;
  year: number;
  nickname: string;
}

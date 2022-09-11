import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupLocalDTO } from './dto/signup-local.dto';
import { SignupDTO } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}
  async signupLocal(dto: SignupLocalDTO) {
    const hasedPassword = await this.hashPassword(dto.password);

    this.checkDuplication(dto);
    return this.userRepo.insert({ ...dto, password: hasedPassword });
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  private checkDuplication({ email }: SignupDTO) {
    const emailDuplicated = this.userRepo.findOneBy({ email });
    if (emailDuplicated) throw new ConflictException('이메일 중복');
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

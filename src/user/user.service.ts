import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { LoginResDto } from '../auth/dto/login-res.dto';
import { SignupLocalDTO } from './dto/signup-local.dto';
import { SignupDTO } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
  ) {}

  getUser(id: number) {
    return this.userRepo.findOne({
      where: { id },
      relations: { career: { job: true } },
    });
  }
  async signupLocal(dto: SignupLocalDTO): Promise<LoginResDto> {
    const hasedPassword = await this.hashPassword(dto.password);
    const password = hasedPassword;

    await this.checkDuplication(dto);

    await this.userRepo.insert({
      ...dto,
      password,
      nickname: new Date().getMilliseconds().toString(),
    });
    return this.authService.loginLocal({ password, email: dto.email });
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  private async checkDuplication({ email }: SignupDTO) {
    const emailDuplicated = await this.userRepo.findOneBy({ email });
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

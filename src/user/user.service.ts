import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { AuthServiceImpl } from '../auth/auth.serviceimpl';
import { LoginResDto } from '../auth/dto/login-res.dto';
import { SignupLocalDTO } from './dto/signup-local.dto';
import { SignupDTO } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Career } from './entities/career';
import { Job } from './entities/job.entity';
import { Password } from './entities/password.entity';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthServiceImpl,
    private readonly dataSource: DataSource,
  ) {}

  getUser(id: number) {
    return this.userRepo.findOne({
      where: { id },
      relations: { career: { job: true } },
    });
  }

  // TODO: transaction
  async signupLocal(dto: SignupLocalDTO): Promise<LoginResDto> {
    await this.checkDuplication(dto);
    const { email, password } = dto;
    const user = new User({
      email,
      nickname: new Date().getMilliseconds().toString(),
      password: new Password(),
    });

    await user.signup(password);

    await this.userRepo.save(user);
    return this.authService.loginLocal({
      password,
      email,
    });
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

  async update(id: number, dto: UpdateUserDto) {
    const job = await this.dataSource
      .getRepository(Job)
      .findOneBy({ id: dto.jobId });
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { career: { job: true } },
    });

    const career = this.dataSource
      .getRepository(Career)
      .create({ job, year: dto.year });
    user.update({ ...dto, career });
    return this.userRepo.save(user);
  }

  async updateProfileImage(id: number, url: string) {
    const user = await this.userRepo.findOneByOrFail({ id });
    user.image = url;
    return this.userRepo.save(user);
  }
}

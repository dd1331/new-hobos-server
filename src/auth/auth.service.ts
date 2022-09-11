import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { LoginLocalDto } from './dto/login-local.dto';
import { LoginResDto } from './dto/login-res.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepo.findOneBy({ email });
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async loginLocal(dto: LoginLocalDto): Promise<LoginResDto> {
    const { email, password } = dto;
    const user = await this.userRepo.findOneByOrFail({ email });

    this.comparePasswordOrFail(password);

    const { accessToken, refreshToken } = this.generateTokens(user);
    user.login(refreshToken);
    await this.userRepo.save(user);

    return { accessToken: 'fadfds', refreshToken: 'fdsa' };
  }

  private generateTokens({ email, id }: User) {
    const payload = { email, id };
    const res = this.jwtService.sign(payload);
    return { accessToken: 'fadfds', refreshToken: 'fdsa' };
  }

  private comparePasswordOrFail(password: string) {}

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

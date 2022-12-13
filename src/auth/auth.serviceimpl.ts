import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { JWT } from './auth.constant';
import { AuthService } from './auth.service';
import { LoginLocalDto } from './dto/login-local.dto';
import { LoginResDto } from './dto/login-res.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) return null;
    await user.password.comparePassword(pass);
    return user;
  }

  async loginLocal(dto: LoginLocalDto): Promise<LoginResDto> {
    const { email, password } = dto;
    const user = await this.userRepo.findOneOrFail({
      where: { email },
      relations: { career: { job: true } },
    });
    await user.password.comparePassword(password);

    const tokens = this.generateTokens(user);
    user.login(tokens.refreshToken);
    await this.userRepo.save(user);

    return { tokens, user };
  }

  private generateTokens({ email, id }: User) {
    const payload = { email, id };
    const accessToken = this.jwtService.sign(payload, {
      secret: JWT.SECRET,
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: JWT.SECRET + 2,
      expiresIn: '1d',
    });
    return { accessToken, refreshToken };
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

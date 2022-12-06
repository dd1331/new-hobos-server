import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from '../user/user.repository';
import { JWT } from './auth.constant';
import { AuthController } from './auth.controller';
import { AuthServiceImpl } from './auth.serviceimpl';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthServiceImpl,
    LocalStrategy,
    UserRepository,
    JwtService,
    JwtStrategy,
  ],
  exports: [AuthServiceImpl],
})
export class AuthModule {}

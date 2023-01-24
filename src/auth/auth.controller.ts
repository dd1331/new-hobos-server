import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthProvider } from '../user/entities/user.entity';
import { AuthServiceImpl } from './auth.serviceimpl';
import { LoginLocalDto } from './dto/login-local.dto';
import { LoginResDto } from './dto/login-res.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SSOReqUser, User } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServiceImpl) {}

  @HttpCode(HttpStatus.OK)
  @Post('login/local')
  async login(@Body() dto: LoginLocalDto): Promise<LoginResDto> {
    return this.authService.loginLocal(dto);
  }

  @UseGuards(AuthGuard('naver'))
  @Get('naver')
  async naverCallback(
    @User() { ssoId, email }: SSOReqUser,
    @Res() res: Response,
  ) {
    const login = await this.authService.signupSSO({
      ssoId,
      provider: AuthProvider.NAVER,
      email,
    });
    res.redirect(
      HttpStatus.MOVED_PERMANENTLY,
      'http://127.0.0.1:5173/naver/callback?accessToken=' +
        login.tokens.accessToken +
        '&refreshToken=' +
        login.tokens.refreshToken,
    );
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

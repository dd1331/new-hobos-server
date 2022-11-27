import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthPassGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    return user;
  }
}

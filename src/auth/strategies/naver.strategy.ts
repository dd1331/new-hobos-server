import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { AuthServiceImpl } from '../auth.serviceimpl';
import { SSOReqUser } from '../user.decorator';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthServiceImpl) {
    super({
      clientID: 'ZmGFcvBGsjbKVJm4tkay',
      clientSecret: '7CITE2lpBb',
      callbackURL: 'http://127.0.0.1:3000/auth/naver',
      passReqToCallback: true,
    });
  }
  // (req: express.Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) => void;
  validate(
    req: Express.Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ): SSOReqUser {
    return { email: profile._json.email, ssoId: profile.id };
  }
}

import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { dataSourceOptions } from '../../../data-source';
import { HttpExceptionFilter } from '../../http-exception.filter';
import { SignupLocalDTO } from '../../user/dto/signup-local.dto';
import { UserModule } from '../../user/user.module';
import { AuthModule } from '../auth.module';
import { LoginLocalDto } from '../dto/login-local.dto';
import { LoginResDto } from '../dto/login-res.dto';

describe('Auth', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          ...dataSourceOptions(),
          autoLoadEntities: true,
        }),
      ],
    })
      .overrideFilter(HttpExceptionFilter)
      .useClass(HttpExceptionFilter)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    req = request(app.getHttpServer());
  });

  describe('auth', () => {
    let accessToken;
    const dto: SignupLocalDTO = {
      email: 't4123est@test.com',
      password: '1234',
    };
    beforeAll(async () => {
      const { user, tokens }: LoginResDto = await signupLocal(req, dto);
      accessToken = tokens.accessToken;
    });
    it('로그인 성공', async () => {
      expect.assertions(3);

      const loginDto: LoginLocalDto = { ...dto };
      const { tokens, user }: LoginResDto = await loginLocal(
        req,
        loginDto,
        accessToken,
      );
      expect(user.email).toBe(dto.email);
      expect(tokens.accessToken).toBe(accessToken);
      expect(tokens.refreshToken).toBeTruthy();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
// FIXME: duplicated
async function signupLocal(
  req: request.SuperTest<request.Test>,
  dto: SignupLocalDTO,
): Promise<LoginResDto> {
  const { body } = await req
    .post('/user/signup/local')
    .send(dto)
    .expect(HttpStatus.CREATED);
  return body;
}
// FIXME: duplicated
async function loginLocal(
  req: request.SuperTest<request.Test>,
  loginDto: LoginLocalDto,
  accessToken: any,
): Promise<LoginResDto> {
  const { body } = await req

    .post('/auth/login/local')
    .send(loginDto)
    .set({ Authorization: 'Bearer ' + accessToken })
    .expect(HttpStatus.OK);
  return body;
}

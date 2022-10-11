import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { dataSourceOptions } from '../../data-source';
import { HttpExceptionFilter } from '../http-exception.filter';
import { SignupLocalDTO } from '../user/dto/signup-local.dto';
import { UserModule } from '../user/user.module';
import { AuthModule } from './auth.module';
import { LoginLocalDto } from './dto/login-local.dto';
import { LoginResDto } from './dto/login-res.dto';

describe('Auth', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        UserModule,
        TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
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
    const dto: SignupLocalDTO = { email: 'test@test.com', password: '1234' };
    beforeAll(async () => {
      const { body } = await req
        .post('/user/signup/local')
        .send(dto)
        .expect(HttpStatus.CREATED);
      const { user, tokens }: LoginResDto = body;
      accessToken = tokens.accessToken;
    });
    it('로그인 성공', async () => {
      expect.assertions(3);

      const loginDto: LoginLocalDto = { ...dto };
      const { body } = await req
        .post('/auth/login/local')
        .send(loginDto)
        .set({ Authorization: 'Bearer ' + accessToken })
        .expect(HttpStatus.OK);
      const { tokens, user }: LoginResDto = body;
      expect(user.email).toBe(dto.email);
      expect(tokens.accessToken).toBe(accessToken);
      expect(tokens.refreshToken).toBeTruthy();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

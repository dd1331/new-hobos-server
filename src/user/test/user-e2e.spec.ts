import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../../../data-source';
import { SignupLocalDTO } from '../dto/signup-local.dto';
import { UserModule } from '../user.module';
import { UserService } from '../user.service';

describe('User', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    userService = app.get<UserService>(UserService);
    await app.init();
  });

  it(`/GET User`, async () => {
    const dto: SignupLocalDTO = { email: 'test@test.com', password: 'tests' };

    const res = await userService.signupLocal(dto);
    expect.assertions(2);
    expect(res.tokens.accessToken).toBeTruthy();
    expect(res.tokens.refreshToken).toBeTruthy();
  });
  it('이메일 유효성', () => {});
  it('비밀번호 유효성', () => {});
  it('이메일 중복', () => {});

  afterAll(async () => {
    await app.close();
  });
});

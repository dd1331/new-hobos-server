import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserModule } from '../../src/user/User.module';
import { UserService } from '../../src/user/User.service';

describe('User', () => {
  let app: INestApplication;
  const userService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useValue(UserService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET User`, () => {
    // return request(app.getHttpServer()).get('/User').expect(200).expect({
    //   data: userService.findAll(),
    // });
  });
  it('이메일 유효성', () => {});
  it('비밀번호 유효성', () => {});
  it('이메일 중복', () => {});

  afterAll(async () => {
    await app.close();
  });
});

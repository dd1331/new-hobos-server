import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { SignupLocalDTO } from '../user/dto/signup-local.dto';
import { UserService } from '../user/user.service';

describe('Auth', () => {
  let app: INestApplication;
  const authService = { findAll: () => ['test'] };
  let userService: UserService;
  let userId;
  const signupLocalDTO: SignupLocalDTO = {
    email: 'test',
    password: 'fadsfadfsddsf',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    userService = app.get<UserService>(UserService);
    await app.init();
    userId = await userService.signupLocal(signupLocalDTO);
  });

  it(`/GET Auth`, () => {
    // return request(app.getHttpServer()).get('/auth').expect(200).expect({
    //   data: authService.findAll(),
    // });
  });
  it.skip('login', () => {
    return request(app.getHttpServer())
      .post('/auth/login/local')
      .expect(200)
      .expect({
        // data: authService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

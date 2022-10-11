import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { dataSourceOptions } from '../../data-source';
import { LoginLocalDto } from '../auth/dto/login-local.dto';
import { LoginResDto } from '../auth/dto/login-res.dto';
import { Category } from '../category/entities/category.entity';
import { HttpExceptionFilter } from '../http-exception.filter';
import { SignupLocalDTO } from '../user/dto/signup-local.dto';
import { UserModule } from '../user/user.module';
import { CreatePostDto } from './dto/create-post.dto';
import { PostCategory } from './entities/post-category.entity';
import { PostModule } from './post.module';

describe('Post', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;
  let manager: EntityManager;
  let category: Category;
  let postCategory: PostCategory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PostModule,
        UserModule,
        TypeOrmModule.forRoot({
          ...dataSourceOptions,
          autoLoadEntities: true,
          entities: [Category],
        }),
      ],
    })
      .overrideFilter(HttpExceptionFilter)
      .useClass(HttpExceptionFilter)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    manager = app.get<EntityManager>(EntityManager);

    category = await manager.save(Category, { title: 'test title' });

    req = request(app.getHttpServer());
  });

  describe('post', () => {
    let accessToken;
    const dto: SignupLocalDTO = { email: 'test@test.com', password: '1234' };
    beforeAll(async () => {
      const { user, tokens }: LoginResDto = await signupLocal(req, dto);
      accessToken = tokens.accessToken;
    });
    it('포스트 성공', async () => {
      expect.assertions(1);
      const postDTO: CreatePostDto = {
        title: 'test title',
        content: 'test content',
        categoryId: category.id,
      };
      const { body } = await req
        .post('/post')
        .set({ Authorization: 'Bearer ' + accessToken })
        .send(postDTO)
        .expect(HttpStatus.CREATED);
      console.log('🚀 ~ file: post-e2e.spec.ts ~ line 54 ~ it ~ body', body);
      expect(body.id).toBeTruthy();
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
    .post('/post/login/local')
    .send(loginDto)
    .set({ Authorization: 'Bearer ' + accessToken })
    .expect(HttpStatus.OK);
  return body;
}

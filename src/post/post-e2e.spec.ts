import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
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
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();

    manager = app.get<EntityManager>(EntityManager);

    category = await manager.save(Category, { title: 'test title' });

    req = request(app.getHttpServer());
  });
  afterAll(async () => {
    await app.close();
  });

  describe('post', () => {
    let accessToken: string;
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
      expect(body.id).toBeTruthy();
    });
    it.only('게시글 조회 성공', async () => {
      // TODO: pagin test
      expect.assertions(3);
      const postDTO: CreatePostDto = {
        title: 'test title',
        content: 'test content',
        categoryId: category.id,
      };
      await post(req, accessToken, postDTO);
      await post(req, accessToken, postDTO);
      const size = 2;
      const { body } = await req
        .get('/post/' + category.id)
        .query({ page: 1, size })
        .expect(HttpStatus.OK);
      const [posted] = body;
      expect(body.length).toBe(size);
      expect(posted.post.title).toBe(postDTO.title);
      expect(posted.post.content).toBe(postDTO.content);
    });
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
async function post(
  req: request.SuperTest<request.Test>,
  accessToken: string,
  postDTO: CreatePostDto,
) {
  await req
    .post('/post')
    .set({ Authorization: 'Bearer ' + accessToken })
    .send(postDTO)
    .expect(HttpStatus.CREATED);
}

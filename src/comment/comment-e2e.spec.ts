import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { dataSourceOptions } from '../../data-source';
import { LoginLocalDto } from '../auth/dto/login-local.dto';
import { LoginResDto } from '../auth/dto/login-res.dto';
import { Category } from '../category/entities/category.entity';
import { HttpExceptionFilter } from '../http-exception.filter';
import { CommentLike } from '../like/entities/comment-like.entity';
import { PostLike } from '../like/entities/post-like.entity';
import { OrmExceptionFilter } from '../orm-exception.filter';
import { CreatePostDto } from '../post/dto/create-post.dto';
import { PostModule } from '../post/post.module';
import { SignupLocalDTO } from '../user/dto/signup-local.dto';
import { UserModule } from '../user/user.module';
import { CommentModule } from './comment.module';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('Comment', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;
  let manager: EntityManager;
  let category: Category;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PostModule,
        UserModule,
        CommentModule,

        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          ...dataSourceOptions(),
          autoLoadEntities: true,
          entities: [Category, CommentLike, PostLike],
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter(), new OrmExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
    const dto: SignupLocalDTO = {
      email: 'teffst@test.com',
      password: '1312312234',
    };

    manager = app.get<EntityManager>(EntityManager);

    category = await manager.save(Category, { title: 'test title' });
    await manager.save(Category, { title: 'test title2' });
    await manager.save(Category, { title: 'test title3' });

    req = request(app.getHttpServer());
    const { user, tokens }: LoginResDto = await signupLocal(req, dto);

    accessToken = tokens.accessToken;
  });
  afterAll(async () => {
    await app.close();
  });

  describe('댓글 작성', () => {
    let posted;
    beforeEach(async () => {
      const postDTO: CreatePostDto = {
        title: 'test title',
        content: 'test content',
        categoryIds: [category.id],
      };
      posted = await post(req, accessToken, postDTO);
    });
    it('댓글 작성 성공', async () => {
      const commentDTO: CreateCommentDto = {
        content: 'test content',
        postId: posted.id,
      };
      await req
        .post('/comment')
        .set({ Authorization: 'Bearer ' + accessToken })
        .send(commentDTO)
        .expect(HttpStatus.CREATED);
    });
    it('댓글 작성 실패', async () => {
      const commentDTO: CreateCommentDto = {
        content: 'test content',
        postId: posted.id,
      };
      await req
        .post('/comment')
        .send(commentDTO)
        .expect(HttpStatus.UNAUTHORIZED);
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
  const { body } = await req
    .post('/post')
    .set({ Authorization: 'Bearer ' + accessToken })
    .send(postDTO)
    .expect(HttpStatus.CREATED);

  return body;
}

/**
 * 본인만 삭제가능
 * 최대 길이
 *
 */

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../data-source';
import { AllExceptionFilter } from './all-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
    LikeModule,
    CategoryModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}

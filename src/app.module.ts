import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UserModule, AuthModule, PostModule, CommentModule, LikeModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

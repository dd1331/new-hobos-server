import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './entities/post-like.entity';
import { CommentLike } from './entities/comment-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike, CommentLike])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}

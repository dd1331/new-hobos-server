import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from '../upload/upload.service';
import { PostCategory } from './entities/post-category.entity';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory])],
  controllers: [PostController],
  providers: [PostService, PostRepository, UploadService],
})
export class PostModule {}

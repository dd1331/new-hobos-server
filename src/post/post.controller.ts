import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { JwtAuthPassGuard } from '../auth/guards/jwt-auth-pass.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReqUser, User } from '../auth/user.decorator';
import { Category } from '../category/entities/category.entity';
import { PagingDTO } from '../common/paging.dto';
import { UploadService } from '../upload/upload.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostFile } from './entities/post-file.entity';
import { Post as PostEntity } from './entities/post.entity';
import { PostService } from './post.service';

class PostResponse {
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Transform(({ value }) => value.map(({ file }) => file.url))
  files: string[];
}
class test {
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }
  @Expose({ name: 'thumbnail' })
  @Type(() => PostFile)
  @Transform(({ obj }) => {
    return obj.files[0]?.file.url;
  })
  files: PostFile[];

  @Expose({ name: 'category' })
  @Transform(({ obj }) => obj.categories[0])
  category?: Category;
}
@Exclude()
class PostListResponse {
  constructor(partial: Partial<PostListResponse>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => test)
  posts: test[];
}

class Home {
  @Expose({ name: 'list' })
  @Type(() => test)
  posts: test[];

  @Expose({ name: 'category' })
  category?: Category;
}
class HomePostListResponse {
  constructor(partial: Partial<HomePostListResponse>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => Home)
  posts: Home[];
}

export class TestDTO extends PagingDTO {
  @Transform(({ value }) => value.map((o) => Number(decodeURIComponent(o))))
  categoryIds: number[];
}
class TestDTO2 extends PagingDTO {
  categoryId: number;
}

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly uploadService: UploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async post(
    @Body() dto: CreatePostDto,
    @User() { id }: ReqUser,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const PATH = process.env.NODE_ENV + '/post/image';
    if (files.length) {
      dto.fileUrls = await this.uploadService.upload(id, PATH, files);
    }

    dto.posterId = id;
    return this.postService.post(dto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getListByCategory(@Query() dto: TestDTO2): Promise<PostListResponse> {
    const res = await this.postService.getListByCategory(dto);
    return new PostListResponse({ posts: res });
  }
  @Get('home')
  @UseInterceptors(ClassSerializerInterceptor)
  async getHomeList(@Query() dto: TestDTO) {
    const res = await this.postService.getHomeList(dto);
    return new HomePostListResponse({ posts: res });
    // return res;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthPassGuard)
  @Get(':id')
  async getPostViewAndRead(
    @User() user: ReqUser | false,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = user ? user.id : null;
    const { post, liked } = await this.postService.getPostViewAndRead(
      userId,
      id,
    );
    post.liked = liked;

    const res = new PostResponse(post);

    return res;
  }
  @Get()
  getList(@Query() dto: PagingDTO) {
    return this.postService.getList(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@User() { id }: ReqUser, @Body() dto: UpdatePostDto) {
    return this.postService.update({ ...dto, posterId: id });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() { id }: ReqUser, @Param('id', ParseIntPipe) postId: number) {
    return this.postService.remove({ posterId: id, id: postId });
  }
}

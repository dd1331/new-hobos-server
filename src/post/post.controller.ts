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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Transform } from 'class-transformer';
import { JwtAuthPassGuard } from '../auth/jwt-auth-pass.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReqUser, User } from '../auth/user.decorator';
import { PagingDTO } from '../common/paging.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostService } from './post.service';

class PostResponse {
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }
  liked: boolean;
}

export class TestDTO extends PagingDTO {
  @Transform(({ value }) => {
    return value.map((o) => Number(decodeURIComponent(o)));
  })
  categoryIds: number[];
}
class TestDTO2 extends PagingDTO {
  categoryId: number;
}

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  post(@Body() dto: CreatePostDto, @User() { id }: ReqUser) {
    dto.posterId = id;
    return this.postService.post(dto);
  }
  @Get()
  getListByCategory(@Query() dto: TestDTO2) {
    return this.postService.getListByCategory(dto);
  }
  @Get('home')
  getHomeList(@Query() dto: TestDTO) {
    return this.postService.getHomeList(dto);
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
    const res = new PostResponse(post);
    res.liked = liked;
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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReqUser, User } from '../auth/user.decorator';
import { PagingDTO } from '../common/paging.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

class TestDTO extends PagingDTO {
  @Transform(({ value }) => {
    return value.map((o) => Number(decodeURIComponent(o)));
  })
  categoryIds: number[];
}

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  post(@Body() dto: CreatePostDto, @User() { id }: ReqUser) {
    dto.userId = id;
    return this.postService.post(dto);
  }
  @Get('category/:id')
  getListByCategory(@Param('id') id: number, @Query() dto: PagingDTO) {
    return this.postService.getListByCategory(dto, id);
  }
  @Get('home')
  getHomeList(@Query() dto: TestDTO) {
    return this.postService.getHomeList(dto);
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPost(id);
  }
  @Get()
  getList(@Query() dto: PagingDTO) {
    return this.postService.getList(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@User() { id }: ReqUser, @Body() dto: UpdatePostDto) {
    return this.postService.update({ ...dto, userId: id });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() { id }: ReqUser, @Param('id', ParseIntPipe) postId: number) {
    return this.postService.remove({ userId: id, id: postId });
  }
}

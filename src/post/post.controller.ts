import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReqUser, User } from '../auth/user.decorator';
import { PagingDTO } from '../common/paging.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  post(@Body() dto: CreatePostDto, @User() { id }: ReqUser) {
    dto.userId = id;
    return this.postService.post(dto);
  }

  @Get(':categoryId')
  getList(@Query() dto: PagingDTO, @Param('categoryId') categoryId: number) {
    return this.postService.getList(categoryId, dto);
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

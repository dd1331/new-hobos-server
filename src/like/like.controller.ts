import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReqUser, User } from '../auth/user.decorator';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('post/:id')
  likePost(@User() { id }: ReqUser, @Param('id', ParseIntPipe) postId: number) {
    return this.likeService.likePost(id, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comment/:id')
  likeComment(
    @User() { id }: ReqUser,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return this.likeService.likeComment(id, commentId);
  }

  @Get()
  findAll() {
    return this.likeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
    return this.likeService.update(+id, updateLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(+id);
  }
}

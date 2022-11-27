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
import { JwtAuthPassGuard } from '../auth/jwt-auth-pass.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReqUser, User } from '../auth/user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() { id }: ReqUser, @Body() dto: CreateCommentDto) {
    dto.commenterId = id;
    return this.commentService.create(dto);
  }

  @UseGuards(JwtAuthPassGuard)
  @Get()
  findAll(@User() user: ReqUser | false, @Query('postId') postId: number) {
    const userId = user ? user.id : null;
    return this.commentService.findAll(userId, postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  createChild(
    @User() { id }: ReqUser,
    @Param('id') commentId: number,
    @Body() dto: CreateCommentDto,
  ) {
    dto.commenterId = id;
    return this.commentService.createChild(commentId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @User() { id }: ReqUser,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.remove(commentId, id);
  }
}

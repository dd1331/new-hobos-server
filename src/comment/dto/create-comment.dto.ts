import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsPositive()
  postId: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  commenterId?: number;
}

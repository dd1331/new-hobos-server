import { Transform } from 'class-transformer';

export class CreatePostDto {
  title: string;
  content: string;
  @Transform(({ value }) => JSON.parse(value))
  categoryIds: number[];
  posterId?: number;

  fileUrls?: string[];
}

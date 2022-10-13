export class CreatePostDto {
  title: string;
  content: string;
  categoryIds: number[];
  userId?: number;
}

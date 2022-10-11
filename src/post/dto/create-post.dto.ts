export class CreatePostDto {
  title: string;
  content: string;
  categoryId: number;
  userId?: number;
}

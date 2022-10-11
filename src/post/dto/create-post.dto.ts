export class CreatePostDto {
  title: string;
  content: string;
  category: number;
  userId?: number;
}

export class CreatePostDto {
  title: string;
  content: string;
  categoryIds: number[];
  posterId?: number;
}

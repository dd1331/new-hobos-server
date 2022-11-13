import { Type } from 'class-transformer';

export class PagingDTO {
  @Type(() => Number)
  page: number;

  @Type(() => Number)
  size: number;

  get take() {
    if (!this.size) return 5;
    return this.size;
  }

  get skip() {
    if (!this.page || !this.size) return 0;
    return (this.page - 1) * this.size;
  }
}

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PostLike } from './entities/post-like.entity';

@Injectable()
export class LikeService {
  constructor(private readonly dataSource: DataSource) {}
  // TODO: composite unique key
  async create(likerId: number, postId: number) {
    const repo = this.dataSource.getRepository(PostLike);
    const exisiting = await repo.findOne({
      where: { likerId, postId },
      withDeleted: true,
    });
    if (exisiting && exisiting.deletedAt) {
      return repo.restore(exisiting.id);
    }
    if (exisiting && !exisiting.deletedAt) {
      return repo.softRemove(exisiting);
    }
    const like = repo.create({ likerId, postId });
    return repo.save(like);
  }

  findAll() {
    return `This action returns all like`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}

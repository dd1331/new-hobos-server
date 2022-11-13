import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly dataSource: DataSource) {}
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  getCategories() {
    const categoryRepo = this.dataSource.getRepository(Category);
    return categoryRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}

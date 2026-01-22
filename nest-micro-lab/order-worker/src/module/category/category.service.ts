import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPO')
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, data);
    return this.categoryRepo.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
  }
}

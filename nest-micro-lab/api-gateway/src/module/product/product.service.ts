import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPO')
    private readonly productRepo: Repository<Product>,
    @Inject('CATEGORY_REPO')
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    // Ensure category exists
    const category = await this.categoryRepo.findOne({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new BadRequestException(
        `Category with id ${data.categoryId} does not exist`,
      );
    }

    const product = this.productRepo.create({ ...data, category });
    return this.productRepo.save(product);
  }

  async findAll(query: QueryProductDto) {
    const { categoryId, minPrice, maxPrice, page = 1, limit = 10 } = query;

    // Build where conditions
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Handle price filtering
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [data, total] = await this.productRepo.findAndCount({
      where,
      relations: ['category'], // Include category info
      skip,
      take: limit,
      order: { name: 'ASC' }, // Optional: default sorting
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (data.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new BadRequestException(
          `Category with id ${data.categoryId} does not exist`,
        );
      }
      product.category = category;
    }

    Object.assign(product, data);
    return this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}

import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPO')
    private readonly productRepo: Repository<Product>,

    @Inject('CATEGORY_REPO')
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${dto.categoryId} not found`,
      );
    }

    try {
      const product = this.productRepo.create(dto);
      return await this.productRepo.save(product);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Product already exists');
      }
      throw error;
    }
  }

  async findAll(filterDto: GetProductsFilterDto = {}): Promise<Product[]> {
    const { categoryId, minPrice, maxPrice, page = 1, limit = 10 } = filterDto;

    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const data = await query.getMany(); // 👈 ONLY array

    return data;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id: id.toString() },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    this.productRepo.merge(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);
    return this.productRepo.remove(product);
  }
}

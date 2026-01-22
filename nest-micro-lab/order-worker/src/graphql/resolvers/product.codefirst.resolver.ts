import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductType } from '../types/product.type';
import { CreateProductInput } from '../inputs/create-product.input';
import { ProductService } from '../../module/product/product.service';
import { CategoryService } from '../../module/category/category.service';
import { CategoryType } from '../types/category.type';

@Resolver(() => ProductType)
export class ProductCodeFirstResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Query(() => [ProductType])
  products() {
    return this.productService.findAll();
  }

  @Query(() => ProductType, { nullable: true })
  product(@Args('id') id: number) {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductType)
  createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.create(input);
  }

  @ResolveField(() => CategoryType, { nullable: true })
  category(@Parent() product: ProductType) {
    return this.categoryService.findOne(String(product.categoryId));
  }
}

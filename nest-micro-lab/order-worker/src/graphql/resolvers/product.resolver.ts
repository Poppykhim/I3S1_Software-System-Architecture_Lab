import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductService } from '../../module/product/product.service';
import { CategoryService } from '../../module/category/category.service';

@Resolver('Product')
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  // Fixed: Extract the 'data' array from the paginated response
  @Query('products')
  async products() {
    const result = await this.productService.findAll();
  }

  @Query('product')
  product(@Args('id') id: string) {
    // GraphQL ID comes as string; convert if needed
    return this.productService.findOne(Number(id));
  }

  @Mutation('createProduct')
  createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
    @Args('categoryId') categoryId: string,
  ) {
    return this.productService.create({
      name,
      price,
      categoryId,
      sku: '',
    });
  }

  // ✅ relation: Product.category
  @ResolveField('category')
  category(@Parent() product: any) {
    // Ensure we handle both potential property names from TypeORM joins
    const catId =
      product.categoryId || (product.category ? product.category.id : null);
    return this.categoryService.findOne(catId);
  }
}

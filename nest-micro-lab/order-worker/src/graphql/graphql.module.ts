import { Module } from '@nestjs/common';
// import { CategoryResolver } from './resolvers/category.resolver';
// import { ProductResolver } from './resolvers/product.resolver';

// ✅ import your existing modules/services
import { ProductModule } from '../module/product/product.module';
import { CategoryModule } from '../module/category/category.module';
import { CategoryCodeFirstResolver } from './resolvers/category.codefirst.resolver';
import { ProductCodeFirstResolver } from './resolvers/product.codefirst.resolver';

@Module({
  imports: [CategoryModule, ProductModule],
  //   providers: [CategoryResolver, ProductResolver],
  providers: [CategoryCodeFirstResolver, ProductCodeFirstResolver],
})
export class GraphqlModule {}

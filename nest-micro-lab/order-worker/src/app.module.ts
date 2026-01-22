import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';
import { NotificationModule } from './notifications/notifications.module';
import { CoreModule } from './core/core.module';
import { CategoryModule } from './module/category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { Category } from './module/category/entities/category.entity';
import { ProductModule } from './module/product/product.module';
import { Product } from './module/product/entities/product.entity';
import { Receipt } from './database/entities/receipts.entity';
import { DobModule } from './DOB/DOBs.module';
import { CustomersModule } from './customers/customer.module';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers/apollo.driver';
import { ApolloDriverConfig } from '@nestjs/apollo/dist/interfaces/apollo-driver-config.interface';
import { GraphQLModule } from '@nestjs/graphql/dist/graphql.module';
import { join } from 'path/win32';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    CoreModule,
    OrdersModule,
    ReceiptsModule,
    PaymentsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'order-worker',
      autoLoadEntities: true,
      synchronize: true,
    }),
    NotificationModule,
    NotificationModule.forRoot({
      appName: 'API Gateway Lab',
      defaultChannel: 'log',
      enable: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }), // Load .env first
    DatabaseModule.forRoot({
      host: process.env.DB_HOST || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'order-worker',
      entities: [Category, Product, Receipt],
    }),
    CategoryModule,
    ProductModule,
    DobModule,
    CustomersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      // ✅ We will switch between schema-first and code-first later
      // typePaths: [join(process.cwd(), 'src/graphql/schema/*.graphql')], // schema-first
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'), // code-first (later)

      playground: true,
    }),
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

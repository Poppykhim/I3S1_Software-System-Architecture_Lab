import { Module } from '@nestjs/common';
import { CustomersController } from './customer.controller';
import { CustomersService } from './customer.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}

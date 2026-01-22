import { Module, forwardRef } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [],
  controllers: [],
})
export class PaymentsModule {}

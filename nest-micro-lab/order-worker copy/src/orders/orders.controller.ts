/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(`Received order_created event: ${JSON.stringify(data)}`);
  }

  @EventPattern('order_deleted')
  handleOrderDeleted(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('incoming message: order_deleted');
  }
}

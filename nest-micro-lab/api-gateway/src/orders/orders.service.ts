/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(@Inject('ORDERS_SERVICE') private readonly client: ClientProxy) {}

  createOrder(orderDto: any) {
    console.log('emit order_created');
    this.client.emit('order_created', '');
    return { status: 'Order accepted', order: orderDto };
  }

  deleteOrder() {
    this.client.emit('order_deleted', '');
    return { status: 'Order deleted' };
  }
}

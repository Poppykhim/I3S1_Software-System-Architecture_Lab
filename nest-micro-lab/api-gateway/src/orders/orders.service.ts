/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_SERVICE') private client: ClientProxy,
    private readonly notifications: NotificationsService, // ✅
  ) {}

  createOrder(orderDto: any) {
    this.client.emit('order_created', {
      order: orderDto,
      createdAt: new Date().toISOString(),
    });

    this.notifications.notify('orders', 'order_created', {
      order: orderDto,
      createdAt: new Date().toISOString(),
    });

    return { status: 'Order accepted', order: orderDto };
  }

  deleteOrder() {
    this.client.emit('order_deleted', '');
    return { status: 'Order deleted' };
  }
}

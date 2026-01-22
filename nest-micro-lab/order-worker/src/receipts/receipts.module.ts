import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { Receipt } from 'src/database/entities/receipts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notifications/notifications.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Receipt]),
    NotificationModule,
    NotificationModule.forFeature({
      featureName: 'receipts',
      prefix: '[RECEIPTS]',
      channels: ['log'], // only log for receipts
    }),
  ],
  providers: [ReceiptsService],
  controllers: [ReceiptsController],
})
export class ReceiptsModule {}

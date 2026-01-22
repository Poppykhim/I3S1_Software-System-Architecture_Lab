import { DynamicModule, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CoreModule } from 'src/core/core.module';
import {
  NotificationFeatureOptions,
  NotificationModuleOptions,
} from './interfaces';
import { NotificationsRegistryModule } from './notifications-registry.module';
import {
  NOTIFICATION_FEATURE_OPTIONS,
  NOTIFICATION_OPTIONS,
} from './constants';
import { NotificationFeatureRegistrar } from './notifications-feature.registrar';

@Module({
  imports: [NotificationsRegistryModule], // ✅ registry always available
})
export class NotificationModule {
  static forRoot(options: NotificationModuleOptions): DynamicModule {
    return {
      module: NotificationModule,
      global: true, // optional
      providers: [
        { provide: NOTIFICATION_OPTIONS, useValue: options },
        NotificationsService,
      ],
      exports: [NotificationsService],
    };
  }

  static forFeature(feature: NotificationFeatureOptions): DynamicModule {
    return {
      module: NotificationModule,
      providers: [
        { provide: NOTIFICATION_FEATURE_OPTIONS, useValue: feature },
        NotificationFeatureRegistrar,
      ],
    };
  }
}

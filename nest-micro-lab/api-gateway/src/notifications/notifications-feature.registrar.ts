import { Inject, Injectable } from '@nestjs/common';
import {
  NOTIFICATION_FEATURE_OPTIONS,
  NOTIFICATION_FEATURE_REGISTRY,
} from './constants';
import type { NotificationFeatureOptions } from './interfaces';

@Injectable()
export class NotificationFeatureRegistrar {
  constructor(
    @Inject(NOTIFICATION_FEATURE_REGISTRY)
    private readonly registry: NotificationFeatureOptions[],

    @Inject(NOTIFICATION_FEATURE_OPTIONS)
    private readonly feature: NotificationFeatureOptions,
  ) {
    // runs when the module loads
    this.registry.push(this.feature);
  }
}

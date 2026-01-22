// src/common/pipes/phone-normalize.pipe.ts

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PhoneNormalizePipe implements PipeTransform {
  transform(value: string) {
    if (!value) throw new BadRequestException('Phone number is required');

    // Remove spaces, dashes, parentheses
    let normalized = value.replace(/[\s\-\(\)]/g, '');

    if (/^0\d+/.test(normalized)) {
      normalized = '+855' + normalized.substring(1);
    }

    if (!normalized.startsWith('+855')) {
      throw new BadRequestException('Phone number must start with +855');
    }

    if (!/^\+855\d{8,9}$/.test(normalized)) {
      throw new BadRequestException('Invalid phone number format');
    }

    return normalized;
  }
}

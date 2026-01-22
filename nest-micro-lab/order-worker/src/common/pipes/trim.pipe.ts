// src/common/pipes/trim.pipe.ts

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: string) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Value must be a string');
    }

    const trimmed = value.trim();
    if (!trimmed) {
      throw new BadRequestException('Value cannot be empty');
    }

    return trimmed;
  }
}

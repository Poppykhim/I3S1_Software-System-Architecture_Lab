import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DobValidationPipe implements PipeTransform {
  transform(value: string) {
    if (!value) {
      throw new BadRequestException('Date of birth is required');
    }

    // 1. Check format dd/mm/yyyy
    const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(dobRegex);

    if (!match) {
      throw new BadRequestException(
        'Date of birth must be in dd/mm/yyyy format',
      );
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    // 2. Check year < 2010
    if (year >= 2010) {
      throw new BadRequestException('Date of birth must be before year 2010');
    }

    // 3. Validate actual date
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new BadRequestException('Invalid date of birth');
    }

    return value; // ✅ valid
  }
}

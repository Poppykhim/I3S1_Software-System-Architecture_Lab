// src/common/pipes/verify-customer.pipe.ts
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CustomersService } from 'src/customers/customer.service';
import { TrimPipe } from './trim.pipe';
import { PhoneNormalizePipe } from './PhoneNormalize.pipe';
import { DobValidationPipe } from './dob-validation.pipe';
import { VerifyCustomerRequest } from 'src/customers/dto/verify.dto';

@Injectable()
export class VerifyCustomerPipe implements PipeTransform<
  any,
  VerifyCustomerRequest
> {
  constructor(private readonly customersService: CustomersService) {}

  transform(value: any): VerifyCustomerRequest{
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid request body');
    }

    const dto = value as VerifyCustomerRequest;

    const trimPipe = new TrimPipe();
    const dobPipe = new DobValidationPipe();
    const phonePipe = new PhoneNormalizePipe();

    const fullName = trimPipe.transform(dto.fullName);

    const dob = dobPipe.transform(dto.dob);

    const phone = phonePipe.transform(dto.phone);

    const nationalId = dto.nationalId;

    if (this.customersService.isBlockedPhone(phone)) {
      throw new BadRequestException('This phone is blocked');
    }

    if (this.customersService.isBlockedNationalId(nationalId)) {
      throw new BadRequestException('This national ID is blocked');
    }

    if (this.customersService.isBlockedName(fullName)) {
      throw new BadRequestException('This customer name is blocked');
    }

    return {
      fullName,
      dob,
      phone,
      nationalId,
    };
  }
}

import { ForbiddenException, Injectable, PipeTransform } from '@nestjs/common';
import { CustomersService } from 'src/customers/customer.service';
import { VerifyCustomerRequest } from 'src/customers/dto/verify.dto';

@Injectable()
export class CustomerNotBlockedPipe implements PipeTransform<VerifyCustomerRequest> {
  constructor(private readonly customersService: CustomersService) {}

  transform(value: VerifyCustomerRequest) {
    if (!value || typeof value !== 'object') {
      throw new ForbiddenException('Invalid request body');
    }

    const { phone, nationalId, fullName } = value;

    if (this.customersService.isBlockedPhone(phone)) {
      throw new ForbiddenException('This phone is blocked');
    }

    if (this.customersService.isBlockedNationalId(nationalId)) {
      throw new ForbiddenException('This national ID is blocked');
    }

    if (this.customersService.isBlockedName(fullName)) {
      throw new ForbiddenException('This customer name is blocked');
    }

    return value;
  }
}

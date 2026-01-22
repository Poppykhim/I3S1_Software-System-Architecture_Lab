// src/modules/customers/customers.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { PhoneNormalizePipe } from 'src/common/pipes/PhoneNormalize.pipe';
import { TrimPipe } from 'src/common/pipes/trim.pipe';
import { VerifyCustomerRequest } from './dto/verify.dto';
import { DobValidationPipe } from 'src/common/pipes/dob-validation.pipe';
import { CustomerNotBlockedPipe } from 'src/common/pipes/CustomerNotBlocked.pipe';
import { VerifyCustomerPipe } from 'src/common/pipes/verify-customer.pipe';

@Controller('customers')
export class CustomersController {
  // @Post('verify')
  // verifyCustomer(
  //   @Body(CustomerNotBlockedPipe) body: any,
  //   @Body('fullName', TrimPipe) fullName: string,
  //   @Body('dob', DobValidationPipe) dob: string,
  //   @Body('phone', PhoneNormalizePipe) phone: string,
  //   @Body('nationalId') nationalId?: string,
  // ) {
  //   const normalized: VerifyCustomerRequest = {
  //     fullName,
  //     dob,
  //     phone,
  //     nationalId,
  //   };

  //   return {
  //     ok: true,
  //     normalized,
  //   };
  // }

  @Post('verify')
  verify(@Body(VerifyCustomerPipe) body: VerifyCustomerRequest) {
    return {
      ok: true,
      normalized: body,
    };
  }
}

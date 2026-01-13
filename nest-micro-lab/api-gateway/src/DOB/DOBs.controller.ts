import { Controller, Post, Body } from '@nestjs/common';
import { DobValidationPipe } from 'src/common/pipes/dob-validation.pipe';

@Controller('dob')
export class DobController {
  @Post('validate')
  validateDob(@Body('dob', DobValidationPipe) dob: string) {
    return {
      message: 'Date of birth is valid ✅',
      dob,
    };
  }
}

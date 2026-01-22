// src/modules/customers/dto/verify-customer.dto.ts

export class VerifyCustomerRequest {
  fullName: string; // required
  dob: string; // required, format dd/mm/yyyy
  phone: string; // required
  nationalId?: string; // optional
}

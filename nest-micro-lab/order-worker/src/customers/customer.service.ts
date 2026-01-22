import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  private readonly blockedPhones = ['+85512345678', '+85512613806'];

  private readonly blockedNationalIds = ['NID001', 'A123456789'];

  private readonly blockedNames = ['Virak Rith', 'Tat Chansereyvong'].map(
    (name) => name.toUpperCase(),
  );

  isBlockedPhone(phone: string): boolean {
    if (!phone) return false;
    return this.blockedPhones.includes(phone);
  }

  isBlockedNationalId(nationalId?: string): boolean {
    if (!nationalId) return false;
    return this.blockedNationalIds.includes(nationalId);
  }

  isBlockedName(name: string): boolean {
    if (!name) return false;
    return this.blockedNames.includes(name.trim().toUpperCase());
  }
}

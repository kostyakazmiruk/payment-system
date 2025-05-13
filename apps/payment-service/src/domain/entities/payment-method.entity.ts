export enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
}

export class PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;

  // Credit card fields
  cardNumber?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;

  // Bank account fields
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;

  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;

  isValid(): boolean {
    if (this.type === PaymentMethodType.CREDIT_CARD) {
      return !!this.cardNumber && !!this.expiryMonth && !!this.expiryYear;
    } else if (this.type === PaymentMethodType.BANK_ACCOUNT) {
      return !!this.accountNumber && !!this.routingNumber;
    }
    return false;
  }

  // Returns a masked version of the card number or account number
  getMaskedNumber(): string {
    if (this.type === PaymentMethodType.CREDIT_CARD && this.cardNumber) {
      return `**** **** **** ${this.last4 || this.cardNumber.slice(-4)}`;
    } else if (
      this.type === PaymentMethodType.BANK_ACCOUNT &&
      this.accountNumber
    ) {
      return `****${this.accountNumber.slice(-4)}`;
    }
    return '';
  }
}

import { PaymentMethodType } from '../../domain/entities/payment-method.entity';

export class CreatePaymentMethodCommand {
  constructor(
    public readonly userId: string,
    public readonly type: PaymentMethodType,
    public readonly cardNumber?: string,
    public readonly expiryMonth?: number,
    public readonly expiryYear?: number,
    public readonly cardholderName?: string,
    public readonly bankName?: string,
    public readonly accountNumber?: string,
    public readonly routingNumber?: string,
    public readonly isDefault: boolean = false,
  ) {}
}

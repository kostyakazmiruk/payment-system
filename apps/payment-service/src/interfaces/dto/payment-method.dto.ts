import { PaymentMethodType } from '../../domain/entities/payment-method.entity';

export class PaymentMethodDto {
  id: string;
  userId: string;
  type: PaymentMethodType;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  bankName?: string;
  isDefault: boolean;
  createdAt: Date;

  // Note: We don't include sensitive data like full card numbers
  static fromEntity(entity: any): PaymentMethodDto {
    const dto = new PaymentMethodDto();
    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.type = entity.type;
    dto.last4 = entity.last4;
    dto.expiryMonth = entity.expiryMonth;
    dto.expiryYear = entity.expiryYear;
    dto.cardholderName = entity.cardholderName;
    dto.bankName = entity.bankName;
    dto.isDefault = entity.isDefault;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}

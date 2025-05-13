import {
  TransactionStatus,
  TransactionType,
} from '../../domain/entities/transaction.entity';

export class TransactionDto {
  id: string;
  userId: string;
  paymentMethodId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: any): TransactionDto {
    const dto = new TransactionDto();
    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.paymentMethodId = entity.paymentMethodId;
    dto.type = entity.type;
    dto.amount = entity.amount;
    dto.currency = entity.currency;
    dto.status = entity.status;
    dto.description = entity.description;
    dto.errorMessage = entity.errorMessage;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

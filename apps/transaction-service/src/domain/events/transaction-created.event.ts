import { TransactionType } from '../entities/transaction.entity';

export class TransactionCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly paymentMethodId: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly currency: string,
  ) {}
}

import { TransactionType } from '../../domain/entities/transaction.entity';

export class CreateTransactionCommand {
  constructor(
    public readonly userId: string,
    public readonly paymentMethodId: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly currency: string,
    public readonly description?: string,
  ) {}
}

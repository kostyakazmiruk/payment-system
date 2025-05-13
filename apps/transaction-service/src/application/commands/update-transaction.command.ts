import { TransactionStatus } from '../../domain/entities/transaction.entity';

export class UpdateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly status: TransactionStatus,
    public readonly processorResponse?: any,
    public readonly errorMessage?: string,
  ) {}
}

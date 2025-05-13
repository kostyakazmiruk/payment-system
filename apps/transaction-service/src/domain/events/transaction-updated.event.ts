import { TransactionStatus } from '../entities/transaction.entity';

export class TransactionUpdatedEvent {
  constructor(
    public readonly id: string,
    public readonly status: TransactionStatus,
    public readonly processorResponse?: any,
    public readonly errorMessage?: string,
  ) {}
}

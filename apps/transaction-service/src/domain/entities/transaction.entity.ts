export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
}

export class Transaction {
  id: string;
  userId: string;
  paymentMethodId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description?: string;
  errorMessage?: string;
  processorResponse?: any;
  createdAt: Date;
  updatedAt: Date;

  isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  isProcessing(): boolean {
    return this.status === TransactionStatus.PROCESSING;
  }

  isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }

  // Business logic for transaction updates
  canUpdate(): boolean {
    // Can only update transactions that are not completed or failed
    return (
      this.status !== TransactionStatus.COMPLETED &&
      this.status !== TransactionStatus.FAILED
    );
  }

  markAsProcessing(): void {
    if (!this.canUpdate()) {
      throw new Error('Cannot update a completed or failed transaction');
    }
    this.status = TransactionStatus.PROCESSING;
    this.updatedAt = new Date();
  }

  markAsCompleted(processorResponse?: any): void {
    if (!this.canUpdate()) {
      throw new Error('Cannot update a completed or failed transaction');
    }
    this.status = TransactionStatus.COMPLETED;
    this.processorResponse = processorResponse;
    this.updatedAt = new Date();
  }

  markAsFailed(errorMessage: string, processorResponse?: any): void {
    if (!this.canUpdate()) {
      throw new Error('Cannot update a completed or failed transaction');
    }
    this.status = TransactionStatus.FAILED;
    this.errorMessage = errorMessage;
    this.processorResponse = processorResponse;
    this.updatedAt = new Date();
  }
}

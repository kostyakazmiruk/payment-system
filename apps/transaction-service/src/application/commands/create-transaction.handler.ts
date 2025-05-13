import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionCommand } from './create-transaction.command';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../domain/entities/transaction.entity';
import { TransactionCreatedEvent } from '../../domain/events/transaction-created.event';
import { v4 as uuidv4 } from 'uuid';
import { TransactionRepository } from '../../infrastracture/database/repositories/transaction.repository';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly eventBus: EventBus,
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    // Create a new transaction with PENDING status
    const transaction = new Transaction();
    transaction.id = uuidv4();
    transaction.userId = command.userId;
    transaction.paymentMethodId = command.paymentMethodId;
    transaction.type = command.type;
    transaction.amount = command.amount;
    transaction.currency = command.currency;
    transaction.description = command.description;
    transaction.status = TransactionStatus.PENDING;
    transaction.createdAt = new Date();
    transaction.updatedAt = new Date();

    // Save the transaction to the database
    const savedTransaction =
      await this.transactionRepository.create(transaction);

    // Emit the transaction created event
    this.eventBus.publish(
      new TransactionCreatedEvent(
        savedTransaction.id,
        savedTransaction.userId,
        savedTransaction.paymentMethodId,
        savedTransaction.type,
        savedTransaction.amount,
        savedTransaction.currency,
      ),
    );

    // Send event to verify payment method (if it's a payment transaction)
    if (transaction.type === TransactionType.PAYMENT) {
      this.paymentClient.emit('verify.payment.method', {
        transactionId: transaction.id,
        paymentMethodId: transaction.paymentMethodId,
        amount: transaction.amount,
        currency: transaction.currency,
      });
    }

    return savedTransaction;
  }
}

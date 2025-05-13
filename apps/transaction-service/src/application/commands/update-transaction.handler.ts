import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateTransactionCommand } from './update-transaction.command';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { TransactionUpdatedEvent } from '../../domain/events/transaction-updated.event';
import { TransactionRepository } from '../../infrastracture/database/repositories/transaction.repository';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateTransactionCommand): Promise<Transaction> {
    // Find the transaction
    const transaction = await this.transactionRepository.findById(command.id);

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${command.id} not found`,
      );
    }

    // Update the transaction based on the command
    if (command.status === TransactionStatus.PROCESSING) {
      transaction.markAsProcessing();
    } else if (command.status === TransactionStatus.COMPLETED) {
      transaction.markAsCompleted(command.processorResponse);
    } else if (command.status === TransactionStatus.FAILED) {
      transaction.markAsFailed(
        command.errorMessage || 'Unknown error',
        command.processorResponse,
      );
    }

    // Save the updated transaction
    const updatedTransaction = await this.transactionRepository.update(
      transaction.id,
      {
        status: transaction.status,
        processorResponse: transaction.processorResponse,
        errorMessage: transaction.errorMessage,
        updatedAt: transaction.updatedAt,
      },
    );

    // Emit transaction updated event
    this.eventBus.publish(
      new TransactionUpdatedEvent(
        updatedTransaction.id,
        updatedTransaction.status,
        updatedTransaction.processorResponse,
        updatedTransaction.errorMessage,
      ),
    );

    return updatedTransaction;
  }
}

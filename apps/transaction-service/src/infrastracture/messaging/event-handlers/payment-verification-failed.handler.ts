import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from '../../../application/commands/update-transaction.command';
import { TransactionStatus } from '../../../domain/entities/transaction.entity';

export class PaymentVerificationFailedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly reason: string,
    public readonly error?: string,
  ) {}
}

@EventsHandler(PaymentVerificationFailedEvent)
export class PaymentVerificationFailedHandler
  implements IEventHandler<PaymentVerificationFailedEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: PaymentVerificationFailedEvent) {
    // Update the transaction to FAILED status
    const command = new UpdateTransactionCommand(
      event.transactionId,
      TransactionStatus.FAILED,
      { reason: event.reason },
      event.error || `Payment verification failed: ${event.reason}`,
    );

    await this.commandBus.execute(command);
  }
}

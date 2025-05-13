import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from '../../../application/commands/update-transaction.command';
import { TransactionStatus } from '../../../domain/entities/transaction.entity';

export class PaymentVerificationSuccessEvent {
  constructor(
    public readonly transactionId: string,
    public readonly paymentMethodId: string,
  ) {}
}

@EventsHandler(PaymentVerificationSuccessEvent)
export class PaymentVerificationSuccessHandler
  implements IEventHandler<PaymentVerificationSuccessEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: PaymentVerificationSuccessEvent) {
    // Update the transaction to PROCESSING status
    const command = new UpdateTransactionCommand(
      event.transactionId,
      TransactionStatus.PROCESSING,
    );

    await this.commandBus.execute(command);
  }
}

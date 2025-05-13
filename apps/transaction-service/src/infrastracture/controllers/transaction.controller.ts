import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionCommand } from '../../application/commands/create-transaction.command';
import { UpdateTransactionCommand } from '../../application/commands/update-transaction.command';
import { GetTransactionQuery } from '../../application/queries/get-transaction.handler';
import { GetTransactionsQuery } from '../../application/queries/get-transactions.handler';
import {
  TransactionType,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';

@Controller()
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('create.transaction')
  async createTransaction(@Payload() data: any) {
    const command = new CreateTransactionCommand(
      data.userId,
      data.paymentMethodId,
      data.type || TransactionType.PAYMENT,
      data.amount,
      data.currency,
      data.description,
    );

    return this.commandBus.execute(command);
  }

  @MessagePattern('update.transaction')
  async updateTransaction(@Payload() data: any) {
    const command = new UpdateTransactionCommand(
      data.id,
      data.status,
      data.processorResponse,
      data.errorMessage,
    );

    return this.commandBus.execute(command);
  }

  @MessagePattern('get.transaction')
  async getTransaction(@Payload() data: { id: string }) {
    const query = new GetTransactionQuery(data.id);
    return this.queryBus.execute(query);
  }

  @MessagePattern('get.transactions')
  async getTransactions(
    @Payload() data: { userId: string; limit?: number; offset?: number },
  ) {
    const query = new GetTransactionsQuery(
      data.userId,
      data.limit,
      data.offset,
    );
    return this.queryBus.execute(query);
  }
}

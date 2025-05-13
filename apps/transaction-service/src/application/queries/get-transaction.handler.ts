import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../infrastracture/database/repositories/transaction.repository';

export class GetTransactionQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler
  implements IQueryHandler<GetTransactionQuery>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(query: GetTransactionQuery): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(query.id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${query.id} not found`);
    }

    return transaction;
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../infrastracture/database/repositories/transaction.repository';

export class GetTransactionsQuery {
  constructor(
    public readonly userId: string,
    public readonly limit?: number,
    public readonly offset?: number,
  ) {}
}

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler
  implements IQueryHandler<GetTransactionsQuery>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(
    query: GetTransactionsQuery,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const { transactions, total } =
      await this.transactionRepository.findByUserId(
        query.userId,
        query.limit || 10,
        query.offset || 0,
      );

    return { transactions, total };
  }
}

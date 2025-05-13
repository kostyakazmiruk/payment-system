import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../../domain/entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const result = await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        userId: transaction.userId,
        paymentMethodId: transaction.paymentMethodId,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        description: transaction.description,
        errorMessage: transaction.errorMessage,
        processorResponse: transaction.processorResponse
          ? JSON.stringify(transaction.processorResponse)
          : null,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    });

    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<Transaction | null> {
    const result = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!result) {
      return null;
    }

    return this.mapToEntity(result);
  }

  async findByUserId(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const [results, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.transaction.count({
        where: { userId },
      }),
    ]);

    return {
      transactions: results.map((result) => this.mapToEntity(result)),
      total,
    };
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const result = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...data,
        processorResponse: data.processorResponse
          ? JSON.stringify(data.processorResponse)
          : undefined,
      },
    });

    return this.mapToEntity(result);
  }

  private mapToEntity(data: any): Transaction {
    const transaction = new Transaction();
    transaction.id = data.id;
    transaction.userId = data.userId;
    transaction.paymentMethodId = data.paymentMethodId;
    transaction.type = data.type as TransactionType;
    transaction.amount = data.amount;
    transaction.currency = data.currency;
    transaction.status = data.status as TransactionStatus;
    transaction.description = data.description;
    transaction.errorMessage = data.errorMessage;
    transaction.processorResponse = data.processorResponse
      ? JSON.parse(data.processorResponse)
      : null;
    transaction.createdAt = data.createdAt;
    transaction.updatedAt = data.updatedAt;

    return transaction;
  }
}

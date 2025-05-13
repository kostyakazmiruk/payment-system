import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  PaymentMethod,
  PaymentMethodType,
} from '../../../domain/entities/payment-method.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentMethodRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
    const data = {
      id: uuidv4(),
      userId: paymentMethod.userId,
      type: paymentMethod.type,
      isDefault: paymentMethod.isDefault,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Credit card fields
      cardNumber:
        paymentMethod.type === PaymentMethodType.CREDIT_CARD
          ? paymentMethod.cardNumber
          : null,
      last4:
        paymentMethod.type === PaymentMethodType.CREDIT_CARD
          ? paymentMethod.last4
          : null,
      expiryMonth: paymentMethod.expiryMonth,
      expiryYear: paymentMethod.expiryYear,
      cardholderName: paymentMethod.cardholderName,
      // Bank account fields
      bankName:
        paymentMethod.type === PaymentMethodType.BANK_ACCOUNT
          ? paymentMethod.bankName
          : null,
      accountNumber:
        paymentMethod.type === PaymentMethodType.BANK_ACCOUNT
          ? paymentMethod.accountNumber
          : null,
      routingNumber:
        paymentMethod.type === PaymentMethodType.BANK_ACCOUNT
          ? paymentMethod.routingNumber
          : null,
    };

    const result = await this.prisma.paymentMethod.create({ data });
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<PaymentMethod | null> {
    const result = await this.prisma.paymentMethod.findUnique({
      where: { id },
    });

    if (!result) {
      return null;
    }

    return this.mapToEntity(result);
  }

  async findByUserId(userId: string): Promise<PaymentMethod[]> {
    const results = await this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return results.map((result) => this.mapToEntity(result));
  }

  async update(
    id: string,
    data: Partial<PaymentMethod>,
  ): Promise<PaymentMethod> {
    const result = await this.prisma.paymentMethod.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return this.mapToEntity(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.paymentMethod.delete({
      where: { id },
    });
  }

  async unsetDefaultForUser(userId: string): Promise<void> {
    await this.prisma.paymentMethod.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
        updatedAt: new Date(),
      },
    });
  }

  private mapToEntity(data: any): PaymentMethod {
    const paymentMethod = new PaymentMethod();
    paymentMethod.id = data.id;
    paymentMethod.userId = data.userId;
    paymentMethod.type = data.type as PaymentMethodType;
    paymentMethod.isDefault = data.isDefault;
    paymentMethod.createdAt = data.createdAt;
    paymentMethod.updatedAt = data.updatedAt;

    // Map type-specific fields
    if (data.type === PaymentMethodType.CREDIT_CARD) {
      paymentMethod.cardNumber = data.cardNumber;
      paymentMethod.last4 = data.last4;
      paymentMethod.expiryMonth = data.expiryMonth;
      paymentMethod.expiryYear = data.expiryYear;
      paymentMethod.cardholderName = data.cardholderName;
    } else if (data.type === PaymentMethodType.BANK_ACCOUNT) {
      paymentMethod.bankName = data.bankName;
      paymentMethod.accountNumber = data.accountNumber;
      paymentMethod.routingNumber = data.routingNumber;
    }

    return paymentMethod;
  }
}

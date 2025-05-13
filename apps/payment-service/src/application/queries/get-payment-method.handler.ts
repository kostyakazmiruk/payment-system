import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaymentMethodRepository } from '../../infrastructure/database/repositories/payment-method.repository';
import { NotFoundException } from '@nestjs/common';
import { PaymentMethod } from '../../domain/entities/payment-method.entity';

export class GetPaymentMethodQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetPaymentMethodQuery)
export class GetPaymentMethodHandler
  implements IQueryHandler<GetPaymentMethodQuery>
{
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async execute(query: GetPaymentMethodQuery): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.findById(query.id);

    if (!paymentMethod) {
      throw new NotFoundException(
        `Payment method with ID ${query.id} not found`,
      );
    }

    return paymentMethod;
  }
}

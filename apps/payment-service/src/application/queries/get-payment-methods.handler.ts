import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaymentMethodRepository } from '../../infrastructure/database/repositories/payment-method.repository';
import { PaymentMethod } from '../../domain/entities/payment-method.entity';

export class GetPaymentMethodsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetPaymentMethodsQuery)
export class GetPaymentMethodsHandler
  implements IQueryHandler<GetPaymentMethodsQuery>
{
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async execute(query: GetPaymentMethodsQuery): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.findByUserId(query.userId);
  }
}

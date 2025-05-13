import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePaymentMethodCommand } from '../../application/commands/create-payment-method.command';
import { GetPaymentMethodQuery } from '../../application/queries/get-payment-method.handler';
import { GetPaymentMethodsQuery } from '../../application/queries/get-payment-methods.handler';
import { ProcessPaymentCommand } from '../../application/commands/process-payment.command';

@Controller()
export class PaymentMethodController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('create.payment.method')
  async createPaymentMethod(@Payload() data: any) {
    const command = new CreatePaymentMethodCommand(
      data.userId,
      data.type,
      data.cardNumber,
      data.expiryMonth,
      data.expiryYear,
      data.cardholderName,
      data.bankName,
      data.accountNumber,
      data.routingNumber,
      data.isDefault || false,
    );

    return this.commandBus.execute(command);
  }

  @MessagePattern('get.payment.method')
  async getPaymentMethod(@Payload() data: { id: string }) {
    const query = new GetPaymentMethodQuery(data.id);
    return this.queryBus.execute(query);
  }

  @MessagePattern('get.payment.methods')
  async getPaymentMethods(@Payload() data: { userId: string }) {
    const query = new GetPaymentMethodsQuery(data.userId);
    return this.queryBus.execute(query);
  }

  @MessagePattern('delete.payment.method')
  async deletePaymentMethod(@Payload() data: { id: string }) {
    // Implementation for deleting a payment method
    // This would typically call a command handler
    return { deleted: true, id: data.id };
  }

  @MessagePattern('process.payment')
  async processPayment(@Payload() data: any) {
    const command = new ProcessPaymentCommand(
      data.transactionId,
      data.paymentMethodId,
      data.amount,
      data.currency,
      data.description,
    );

    return this.commandBus.execute(command);
  }
}

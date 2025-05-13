import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentMethodCommand } from './create-payment-method.command';
import { PaymentMethodRepository } from '../../infrastructure/database/repositories/payment-method.repository';
import { BadRequestException } from '@nestjs/common';
import {
  PaymentMethod,
  PaymentMethodType,
} from '../../domain/entities/payment-method.entity';

@CommandHandler(CreatePaymentMethodCommand)
export class CreatePaymentMethodHandler
  implements ICommandHandler<CreatePaymentMethodCommand>
{
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async execute(command: CreatePaymentMethodCommand): Promise<PaymentMethod> {
    const paymentMethod = new PaymentMethod();
    paymentMethod.userId = command.userId;
    paymentMethod.type = command.type;
    paymentMethod.isDefault = command.isDefault;

    if (command.type === PaymentMethodType.CREDIT_CARD) {
      if (!command.cardNumber) {
        throw new BadRequestException(
          'Card number is required for credit card payment methods',
        );
      }

      paymentMethod.cardNumber = command.cardNumber;
      paymentMethod.last4 = command.cardNumber.slice(-4);
      paymentMethod.expiryMonth = command.expiryMonth;
      paymentMethod.expiryYear = command.expiryYear;
      paymentMethod.cardholderName = command.cardholderName;
    } else if (command.type === PaymentMethodType.BANK_ACCOUNT) {
      if (!command.accountNumber) {
        throw new BadRequestException(
          'Account number is required for bank account payment methods',
        );
      }

      paymentMethod.bankName = command.bankName;
      paymentMethod.accountNumber = command.accountNumber;
      paymentMethod.routingNumber = command.routingNumber;
    }

    // Validate the payment method
    if (!paymentMethod.isValid()) {
      throw new BadRequestException('Invalid payment method details');
    }

    // If this is the default payment method, unset any other default methods
    if (paymentMethod.isDefault) {
      await this.paymentMethodRepository.unsetDefaultForUser(command.userId);
    }

    // Save the payment method
    return this.paymentMethodRepository.create(paymentMethod);
  }
}

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentMethodRepository } from '../../database/repositories/payment-method.repository';

export class VerifyPaymentMethodEvent {
  constructor(
    public readonly transactionId: string,
    public readonly paymentMethodId: string,
    public readonly amount: number,
    public readonly currency: string,
  ) {}
}

@EventsHandler(VerifyPaymentMethodEvent)
export class VerifyPaymentMethodHandler
  implements IEventHandler<VerifyPaymentMethodEvent>
{
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientProxy,
  ) {}

  async handle(event: VerifyPaymentMethodEvent) {
    try {
      const paymentMethod = await this.paymentMethodRepository.findById(
        event.paymentMethodId,
      );

      if (!paymentMethod) {
        // Payment method not found, notify transaction service
        this.transactionClient.emit('payment.verification.failed', {
          transactionId: event.transactionId,
          reason: 'PAYMENT_METHOD_NOT_FOUND',
        });
        return;
      }

      // Verify if payment method is valid (e.g., not expired)
      const isValid = this.verifyPaymentMethod(paymentMethod, event.amount);

      if (!isValid) {
        // Payment method is invalid, notify transaction service
        this.transactionClient.emit('payment.verification.failed', {
          transactionId: event.transactionId,
          reason: 'PAYMENT_METHOD_INVALID',
        });
        return;
      }

      // Payment method is valid, process the payment
      this.transactionClient.emit('payment.verification.success', {
        transactionId: event.transactionId,
        paymentMethodId: event.paymentMethodId,
      });

      // Process the payment
      this.processPayment(event);
    } catch (error) {
      // Error occurred during verification, notify transaction service
      this.transactionClient.emit('payment.verification.failed', {
        transactionId: event.transactionId,
        reason: 'VERIFICATION_ERROR',
        error: error.message,
      });
    }
  }

  private verifyPaymentMethod(paymentMethod: any, amount: number): boolean {
    // In a real implementation, you would check:
    // - If card is not expired
    // - If bank account is active
    // - If payment method has sufficient balance or credit

    if (paymentMethod.type === 'CREDIT_CARD') {
      // Check if card is expired
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

      if (
        paymentMethod.expiryYear < currentYear ||
        (paymentMethod.expiryYear === currentYear &&
          paymentMethod.expiryMonth < currentMonth)
      ) {
        return false;
      }
    }

    // For demo purposes, we'll always return true for other checks
    return true;
  }

  private async processPayment(event: VerifyPaymentMethodEvent) {
    // Send a command to process the payment
    this.transactionClient.emit('process.payment', {
      transactionId: event.transactionId,
      paymentMethodId: event.paymentMethodId,
      amount: event.amount,
      currency: event.currency,
    });
  }
}

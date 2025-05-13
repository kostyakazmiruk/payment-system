import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from './process-payment.command';
import { PaymentMethodRepository } from '../../infrastructure/database/repositories/payment-method.repository';
import { NotFoundException } from '@nestjs/common';
import { PaymentProcessedEvent } from '../../domain/events/payment-processed.event';

@CommandHandler(ProcessPaymentCommand)
export class ProcessPaymentHandler
  implements ICommandHandler<ProcessPaymentCommand>
{
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<any> {
    // Find the payment method
    const paymentMethod = await this.paymentMethodRepository.findById(
      command.paymentMethodId,
    );

    if (!paymentMethod) {
      throw new NotFoundException(
        `Payment method with ID ${command.paymentMethodId} not found`,
      );
    }

    try {
      // In a real application, you would integrate with a payment processor here
      // For this demo, we'll simulate a payment processor with a mock function
      const processorResponse = await this.mockPaymentProcessor(
        command.amount,
        paymentMethod,
      );

      // Emit payment processed event
      this.eventBus.publish(
        new PaymentProcessedEvent(
          command.transactionId,
          command.paymentMethodId,
          command.amount,
          processorResponse.success,
          processorResponse,
        ),
      );

      return {
        transactionId: command.transactionId,
        status: processorResponse.success ? 'COMPLETED' : 'FAILED',
        processorResponse,
      };
    } catch (error) {
      // Emit payment failed event
      this.eventBus.publish(
        new PaymentProcessedEvent(
          command.transactionId,
          command.paymentMethodId,
          command.amount,
          false,
          undefined,
          error.message,
        ),
      );

      return {
        transactionId: command.transactionId,
        status: 'FAILED',
        error: error.message,
      };
    }
  }

  private async mockPaymentProcessor(
    amount: number,
    paymentMethod: any,
  ): Promise<any> {
    // Simulate processor delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Randomly fail 10% of payments for testing purposes
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
      return {
        success: false,
        errorCode: 'PROCESSOR_DECLINED',
        message: 'Payment was declined by the processor',
      };
    }

    return {
      success: true,
      transactionId: `proc-${Date.now()}`,
      authCode: `AUTH-${Math.floor(Math.random() * 1000000)}`,
      timestamp: new Date().toISOString(),
    };
  }
}

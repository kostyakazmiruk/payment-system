import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
  ) {}

  async sendToTransactionService(pattern: string, data: any) {
    try {
      return await firstValueFrom(
        this.transactionClient.send(pattern, data).pipe(
          timeout(5000), // 5 seconds timeout
        ),
      );
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Transaction service timeout');
      }
      throw error;
    }
  }

  async sendToPaymentService(pattern: string, data: any) {
    try {
      return await firstValueFrom(
        this.paymentClient.send(pattern, data).pipe(
          timeout(5000), // 5 seconds timeout
        ),
      );
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Payment service timeout');
      }
      throw error;
    }
  }
}

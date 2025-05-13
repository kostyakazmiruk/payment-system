export class PaymentProcessedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly paymentMethodId: string,
    public readonly amount: number,
    public readonly success: boolean,
    public readonly processorResponse?: any,
    public readonly error?: string,
  ) {}
}

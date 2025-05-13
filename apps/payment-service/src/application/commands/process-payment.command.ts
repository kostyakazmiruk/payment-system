export class ProcessPaymentCommand {
  constructor(
    public readonly transactionId: string,
    public readonly paymentMethodId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly description?: string,
  ) {}
}

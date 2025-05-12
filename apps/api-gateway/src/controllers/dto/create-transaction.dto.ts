import { IsString, IsNumber, IsNotEmpty, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID of the payment method to use',
    example: '5f8d0d55-9c24-4851-a0c6-772d8f98b7a1',
  })
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @ApiProperty({
    description: 'Amount to charge',
    minimum: 0.01,
    example: 99.99,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    enum: Currency,
    example: 'USD',
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    description: 'Transaction description',
    required: false,
    example: 'Payment for order #12345',
  })
  @IsString()
  description?: string;
}

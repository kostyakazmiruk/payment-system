import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
}

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Type of payment method',
    enum: PaymentMethodType,
    example: 'CREDIT_CARD',
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @ApiProperty({
    description: 'Credit card number',
    example: '4111111111111111',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  cardNumber?: string;

  @ApiProperty({
    description: 'Card expiry month (1-12)',
    minimum: 1,
    maximum: 12,
    example: 12,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  expiryMonth?: number;

  @ApiProperty({
    description: 'Card expiry year',
    example: 2025,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  expiryYear?: number;

  @ApiProperty({
    description: 'Name of the cardholder',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  cardholderName?: string;

  @ApiProperty({
    description: 'Bank name (for bank accounts)',
    example: 'Chase Bank',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  accountNumber?: string;
}

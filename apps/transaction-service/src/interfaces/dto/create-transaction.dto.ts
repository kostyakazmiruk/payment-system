import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  Min,
  IsOptional,
} from 'class-validator';
import { TransactionType } from '../../domain/entities/transaction.entity';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType = TransactionType.PAYMENT;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @IsOptional()
  @IsString()
  description?: string;
}

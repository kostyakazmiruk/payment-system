import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProxyService } from '../services/proxy.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly proxyService: ProxyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(
    @Body(ValidationPipe) createTransactionDto: CreateTransactionDto,
  ) {
    return this.proxyService.sendToTransactionService(
      'create.transaction',
      createTransactionDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return this.proxyService.sendToTransactionService('get.transaction', {
      id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTransactions() {
    return this.proxyService.sendToTransactionService('get.transactions', {});
  }
}

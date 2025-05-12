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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionController {
  constructor(private readonly proxyService: ProxyService) {}

  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction details' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return this.proxyService.sendToTransactionService('get.transaction', {
      id,
    });
  }

  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getTransactions() {
    return this.proxyService.sendToTransactionService('get.transactions', {});
  }
}

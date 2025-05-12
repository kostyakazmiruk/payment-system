import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProxyService } from '../services/proxy.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('payment-methods')
@ApiBearerAuth()
@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly proxyService: ProxyService) {}

  @ApiOperation({ summary: 'Create a new payment method' })
  @ApiResponse({
    status: 201,
    description: 'Payment method created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPaymentMethod(
    @Body(ValidationPipe) createPaymentMethodDto: CreatePaymentMethodDto,
  ) {
    return this.proxyService.sendToPaymentService(
      'create.payment.method',
      createPaymentMethodDto,
    );
  }

  @ApiOperation({ summary: 'Get a payment method by ID' })
  @ApiResponse({ status: 200, description: 'Payment method details' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPaymentMethod(@Param('id') id: string) {
    return this.proxyService.sendToPaymentService('get.payment.method', { id });
  }

  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiResponse({ status: 200, description: 'List of payment methods' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPaymentMethods() {
    return this.proxyService.sendToPaymentService('get.payment.methods', {});
  }

  @ApiOperation({ summary: 'Delete a payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePaymentMethod(@Param('id') id: string) {
    return this.proxyService.sendToPaymentService('delete.payment.method', {
      id,
    });
  }
}

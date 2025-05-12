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

@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly proxyService: ProxyService) {}

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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPaymentMethod(@Param('id') id: string) {
    return this.proxyService.sendToPaymentService('get.payment.method', { id });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPaymentMethods() {
    return this.proxyService.sendToPaymentService('get.payment.methods', {});
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePaymentMethod(@Param('id') id: string) {
    return this.proxyService.sendToPaymentService('delete.payment.method', {
      id,
    });
  }
}

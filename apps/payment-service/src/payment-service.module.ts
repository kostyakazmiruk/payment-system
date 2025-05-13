import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import appConfig from './config/app.config';

// Command Handlers
import { CreatePaymentMethodHandler } from './application/commands/create-payment-method.handler';
import { ProcessPaymentHandler } from './application/commands/process-payment.handler';

// Query Handlers
import { GetPaymentMethodHandler } from './application/queries/get-payment-method.handler';
import { GetPaymentMethodsHandler } from './application/queries/get-payment-methods.handler';

// Event Handlers
import { VerifyPaymentMethodHandler } from './infrastructure/messaging/event-handlers/verify-payment-method.handler';

// Controllers
import { PaymentMethodController } from './infrastructure/controllers/payment-method.controller';

// Repositories and Services
import { PrismaService } from './infrastructure/database/prisma.service';
import { PaymentMethodRepository } from './infrastructure/database/repositories/payment-method.repository';

const CommandHandlers = [CreatePaymentMethodHandler, ProcessPaymentHandler];

const QueryHandlers = [GetPaymentMethodHandler, GetPaymentMethodsHandler];

const EventHandlers = [VerifyPaymentMethodHandler];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'TRANSACTION_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBIT_MQ_URI') ||
                'amqp://localhost:5672',
            ],
            queue: 'transaction_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentMethodController],
  providers: [
    PrismaService,
    PaymentMethodRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class PaymentModule {}

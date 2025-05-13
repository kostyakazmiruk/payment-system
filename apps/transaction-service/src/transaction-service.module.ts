import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import appConfig from './config/app.config';

// Command Handlers
import { CreateTransactionHandler } from './application/commands/create-transaction.handler';
import { UpdateTransactionHandler } from './application/commands/update-transaction.handler';

// Query Handlers
import { GetTransactionHandler } from './application/queries/get-transaction.handler';
import { GetTransactionsHandler } from './application/queries/get-transactions.handler';

// Event Handlers
import { PaymentVerificationFailedHandler } from './infrastracture/messaging/event-handlers/payment-verification-failed.handler';
import { PaymentVerificationSuccessHandler } from './infrastracture/messaging/event-handlers/payment-verification-success.handler';

// Controllers
import { TransactionController } from './infrastracture/controllers/transaction.controller';

// Repositories and Services
import { PrismaService } from './infrastracture/database/prisma.service';
import { TransactionRepository } from './infrastracture/database/repositories/transaction.repository';

const CommandHandlers = [CreateTransactionHandler, UpdateTransactionHandler];

const QueryHandlers = [GetTransactionHandler, GetTransactionsHandler];

const EventHandlers = [
  PaymentVerificationFailedHandler,
  PaymentVerificationSuccessHandler,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'PAYMENT_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBIT_MQ_URI') ||
                'amqp://localhost:5672',
            ],
            queue: 'payment_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    PrismaService,
    TransactionRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class TransactionModule {}

import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(PaymentModule);
  const configService = app.get(ConfigService);

  // Apply validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Connect to RabbitMQ for microservice communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('RABBIT_MQ_URI') || 'amqp://localhost:5672',
      ],
      queue: 'payment_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Start both HTTP and microservice modes
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') || 3002);

  console.log(
    `Payment Service is running on port ${configService.get('PORT') || 3002}`,
  );
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors();

  // Apply global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Payment System API')
    .setDescription('The Payment System API documentation')
    .setVersion('1.0')
    .addTag('payments')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`API Gateway is running on port ${port}`);
  console.log(
    `Swagger documentation is available at http://localhost:${port}/api`,
  );
}
bootstrap();

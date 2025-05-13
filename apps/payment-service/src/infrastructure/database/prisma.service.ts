import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks() {
    // Close Prisma Client gracefully on application shutdown
    process.on('beforeExit', async () => {
      await this.$disconnect();
    });
  }
}

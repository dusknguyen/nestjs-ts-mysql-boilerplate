import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService extends PrismaClient to manage database connections efficiently.
 * Implements OnModuleInit to establish a connection and OnModuleDestroy to ensure cleanup.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Establishes a connection to the database when the module initializes.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Closes the database connection when the module is destroyed.
   * Prevents memory leaks and ensures proper shutdown handling.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService extends PrismaClient to provide database connection management.
 * Implements OnModuleInit to connect to the database when the module initializes.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Establishes a connection to the database when the module is initialized.
   * This method is called automatically by NestJS during the lifecycle of the module.
   */
  async onModuleInit() {
    // Connect to the database using PrismaClient's $connect method
    await this['$connect']();
  }
}

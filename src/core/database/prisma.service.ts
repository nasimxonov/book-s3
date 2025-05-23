import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleDestroy, OnModuleInit
{
  private readonly logger: Logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected!!');
    } catch (error) {
      this.logger.error(error);
    }
  }
  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Databse disconnected!!');
    } catch (error) {
      this.logger.error(error);
    }
  }
}

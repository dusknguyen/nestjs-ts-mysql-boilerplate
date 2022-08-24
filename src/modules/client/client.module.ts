import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common';
import { ClientGateway } from './gateway';

@Module({
  imports: [TypeOrmModule.forFeature([]), CommonModule],
  providers: [ClientGateway],
  controllers: [],
})
export class ClientModule {}

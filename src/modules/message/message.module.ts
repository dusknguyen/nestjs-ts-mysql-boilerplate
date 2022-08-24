import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entity';

import { CommonModule } from '../common';
import { MessageGateway } from './gateway';
import { MessageService } from './providers';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), CommonModule],
  providers: [MessageService, MessageGateway],
  controllers: [],
})
export class MessageModule {}

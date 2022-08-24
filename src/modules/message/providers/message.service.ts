/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(@InjectRepository(Message) private messageRepository: Repository<Message>) {}

  public async saveMessage(content: string): Promise<any> {
    const newMessage = new Message();
    newMessage.content = content;
    await this.messageRepository.save(newMessage);
    return newMessage;
  }
}

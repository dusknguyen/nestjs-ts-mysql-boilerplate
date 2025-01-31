import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for joining a room via WebSocket.
 * Contains the information required to authenticate and join a room.
 */
export class JoinRoomDto {
  /**
   * Optional token for authenticating the user.
   * @example "your-jwt-token"
   */
  @ApiPropertyOptional()
  @IsOptional()
  token!: string;

  /**
   * The name of the room to join.
   * @example "chat-room-1"
   */
  @ApiProperty()
  @IsNotEmpty()
  room!: string;
}

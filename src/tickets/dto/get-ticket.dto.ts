import { ApiProperty } from '@nestjs/swagger';
import { GetEventDto } from 'src/events/dto/get-event.dto';
import { GetUserDto } from 'src/users/dto/get-user.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';

export class GetTicketDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the ticket',
  })
  id: string;

  @ApiProperty({
    example: '2024-05-01T10:00:00Z',
    description: 'The date and time when the ticket was scanned',
    nullable: true,
  })
  scanDate?: Date;

  @ApiProperty({
    example: '2024-04-01T12:00:00Z',
    description: 'The date and time when the ticket was created',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The user who owns the ticket',
    type: GetUserDto,
  })
  user: GetUserDto;

  @ApiProperty({
    type: GetEventDto,
    description: 'The event associated with the ticket',
  })
  event: GetEventDto;
}

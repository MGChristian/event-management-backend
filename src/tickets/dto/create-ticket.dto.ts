import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the event associated with the ticket',
  })
  @IsNumber()
  @IsNotEmpty()
  eventId: number;
}

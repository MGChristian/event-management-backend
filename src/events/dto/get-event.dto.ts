import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from 'src/users/dto/get-user.dto';

export class GetEventDto {
  @ApiProperty({
    example: 'Tech Conference 2024',
    description: 'Name of the event',
  })
  name: string;

  @ApiProperty({
    example: '2024-09-15T09:00:00Z',
    description: 'Date and time of the event',
  })
  dateStart: Date;

  @ApiProperty({
    example: '2024-09-17T17:00:00Z',
    description: 'End date and time of the event',
  })
  dateEnd: Date;

  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'Location of the event',
  })
  location: string;

  @ApiProperty({
    example:
      'An exciting tech conference covering the latest trends in technology.',
    description: 'Description of the event',
  })
  description: string;

  @ApiProperty({
    example: 500,
    description: 'Capacity of the event',
  })
  capacity: number;

  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    description: 'Base64 encoded image for the event',
    required: false,
  })
  imageBase64?: string;

  @ApiProperty({
    example: '2024-06-01T12:00:00Z',
    description: 'The date and time when the event was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: 150,
    description: 'Number of tickets sold for the event',
  })
  ticketsSold?: number;

  @ApiProperty({
    description: 'Organizer of the event',
    type: GetUserDto,
  })
  organizer: GetUserDto;
}

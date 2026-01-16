import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    example: 'Tech Conference 2024',
    description: 'Name of the event',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '2024-09-15T09:00:00Z',
    description: 'Date and time of the event',
  })
  @IsDateString()
  @IsNotEmpty()
  dateStart: Date;

  @ApiProperty({
    example: '2024-09-17T17:00:00Z',
    description: 'End date and time of the event',
  })
  @IsDateString()
  @IsNotEmpty()
  dateEnd: Date;

  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'Location of the event',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example:
      'An exciting tech conference covering the latest trends in technology.',
    description: 'Description of the event',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 500,
    description: 'Capacity of the event',
  })
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    description: 'Base64 encoded image for the event (optional)',
    required: false,
  })
  @IsString()
  imageBase64?: string;
}

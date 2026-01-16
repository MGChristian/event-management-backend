import { IsNotEmpty, IsUUID } from 'class-validator';

export class ScanTicketDto {
  @IsNotEmpty()
  @IsUUID()
  ticketId: string;
}

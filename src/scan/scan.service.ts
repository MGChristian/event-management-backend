import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { TicketsService } from 'src/tickets/tickets.service';

@Injectable()
export class ScanService {
  constructor(private readonly ticketService: TicketsService) {}

  async scanTicket(id: string) {
    const ticket = await this.ticketService.findById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.scanDate) {
      throw new BadRequestException('Ticket has already been scanned');
    }
    const event = ticket.event;

    if (!event) {
      throw new NotFoundException('Event not found for this ticket');
    }

    const now = dayjs();
    const eventDateStart = dayjs(event.dateStart);
    const eventDateEnd = dayjs(event.dateEnd);

    if (now.isAfter(eventDateEnd)) {
      throw new BadRequestException('Event has already ended');
    }
    if (now.isBefore(eventDateStart.subtract(2, 'hour'))) {
      throw new BadRequestException('Event has not started yet');
    }

    return await this.ticketService.scanTicket(id, dayjs().toDate());
  }
}

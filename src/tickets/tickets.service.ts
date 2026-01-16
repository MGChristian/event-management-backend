import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { EventsService } from 'src/events/events.service';
import { MailerService } from '@nestjs-modules/mailer';
import { create, toDataURL } from 'qrcode';
import { UsersService } from 'src/users/users.service';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private eventsService: EventsService,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}
  async create(userId: number, createTicketDto: CreateTicketDto) {
    const { eventId } = createTicketDto;
    const event = await this.eventsService.findOne(createTicketDto.eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const count = await this.getTotalTickets(createTicketDto.eventId);
    if (count >= event.capacity) {
      throw new ConflictException('Event capacity reached');
    }

    const exists = await this.findByEventAndUser(
      createTicketDto.eventId,
      userId,
    );
    if (exists) {
      throw new ConflictException('User already has a ticket for this event');
    }

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newTicket = this.ticketRepository.create({
      event: { id: eventId },
      user: { id: userId },
    });

    const savedTicket = await this.ticketRepository.save(newTicket);

    console.log('Sending email to:', user.name, 'for ticket:', savedTicket.id);
    // If user.name is undefined here, check your database or your DTO.

    this.sendTicketEmail(
      user.email,
      savedTicket.id,
      event.name,
      user.name,
      event.dateStart,
      event.dateEnd,
    ).catch((error) => {
      console.error('Error sending ticket email:', error);
    });

    return savedTicket;
  }

  async sendTicketEmail(
    email: string,
    ticketId: string,
    eventName: string,
    userName: string,
    eventDateStart: Date,
    eventDateEnd: Date,
  ) {
    const qrDataUrl = await toDataURL(ticketId);
    await this.mailerService.sendMail({
      to: email,
      subject: `Your Ticket for ${eventName}`,
      template: 'tickets', // Name of the template file (without extension)
      context: {
        ticketId: ticketId,
        userName: userName,
        eventName,
        eventDateStart: dayjs(eventDateStart).format('llll'),
        eventDateEnd: dayjs(eventDateEnd).format('llll'),
      },
      attachments: [
        {
          filename: 'ticket_qr.png',
          path: qrDataUrl,
          cid: 'ticket_qr', // same cid value as in the template to reference the image
        },
      ],
    });
  }

  findByEventAndUser(eventId: number, userId: number) {
    return this.ticketRepository.findOne({
      where: { event: { id: eventId }, user: { id: userId } },
    });
  }

  findById(id: string) {
    return this.ticketRepository.findOne({
      select: {
        id: true,
        scanDate: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
        event: {
          id: true,
          name: true,
          dateStart: true,
          dateEnd: true,
        },
      },
      where: { id },
      relations: ['user', 'event'],
    });
  }

  findAll(eventId: number) {
    return this.ticketRepository.find({
      select: {
        id: true,
        scanDate: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
        event: {
          id: true,
          name: true,
          dateStart: true,
          dateEnd: true,
        },
      },
      where: { event: { id: eventId } },
      relations: ['user', 'event'],
    });
  }

  async getTotalTickets(eventId: number): Promise<number> {
    return this.ticketRepository.count({
      where: { event: { id: eventId } },
    });
  }

  async findAllByEvent(eventId: number) {
    const [tickets, count] = await this.ticketRepository.findAndCount({
      select: {
        id: true,
        scanDate: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
        event: {
          id: true,
          name: true,
          dateStart: true,
          dateEnd: true,
        },
      },
      where: { event: { id: eventId } },
      relations: ['user', 'event'],
    });
    return {
      tickets,
      count,
    };
  }

  findMyTickets(userId: number) {
    return this.ticketRepository.find({
      select: {
        id: true,
        scanDate: true,
        createdAt: true,
        event: {
          id: true,
          name: true,
          dateStart: true,
          dateEnd: true,
        },
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
      where: { user: { id: userId } },
      relations: ['event', 'user'],
    });
  }

  scanTicket(id: string, scanDate: Date) {
    return this.ticketRepository.update(id, { scanDate });
  }

  remove(id: string) {
    return `This action removes a #${id} ticket`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) {}
  create(organizerId: number, createEventDto: CreateEventDto) {
    const newEvent = this.eventRepository.create({
      ...createEventDto,
      organizer: { id: organizerId },
    });
    return this.eventRepository.save(newEvent);
  }

  async findAll() {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer') // Fetch organizer details
      .loadRelationCountAndMap('event.ticketsSold', 'event.tickets') // Count tickets and map to 'ticketsSold'
      .orderBy('event.dateStart', 'ASC')
      .getMany();
  }

  async findAllByOrganizer(organizerId: number) {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .where('organizer.id = :organizerId', { organizerId })
      .loadRelationCountAndMap('event.ticketsSold', 'event.tickets') // Count tickets
      .orderBy('event.dateStart', 'ASC')
      .getMany();
  }

  async findOne(id: number) {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.organizer', 'organizer')
      .addSelect(['organizer.id', 'organizer.name', 'organizer.email']) // specific selects from your original code
      .where('event.id = :id', { id })
      .loadRelationCountAndMap('event.ticketsSold', 'event.tickets') // Count tickets
      .getOne();
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.eventRepository.update(id, updateEventDto);
  }

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}

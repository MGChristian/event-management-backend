import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.eventRepository.find();
  }

  findAllByOrganizer(organizerId: number) {
    return this.eventRepository.find({
      where: {
        organizer: { id: organizerId },
      },
      relations: ['organizer'],
      order: { dateStart: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.eventRepository.findOne({
      select: {
        id: true,
        name: true,
        description: true,
        dateStart: true,
        dateEnd: true,
        location: true,
        capacity: true,
        imageBase64: true,
        organizer: {
          id: true,
          name: true,
          email: true,
        },
      },
      relations: ['organizer'],
      where: { id },
    });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.eventRepository.update(id, updateEventDto);
  }

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}

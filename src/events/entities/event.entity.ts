import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  dateStart: Date;

  @Column({ type: 'timestamp' })
  dateEnd: Date;

  @Column()
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  capacity: number;

  @Column({ type: 'text', nullable: true })
  imageBase64: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];

  @ManyToOne(() => User, (user) => user.organizedEvents)
  organizer: User;
}

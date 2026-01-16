import { Module } from '@nestjs/common';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';
import { TicketsModule } from 'src/tickets/tickets.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TicketsModule, EventsModule],
  controllers: [ScanController],
  providers: [ScanService],
})
export class ScanModule {}

import { Module } from '@nestjs/common';
import { TicketmasterService } from './ticketmaster.service';
import { TicketmasterController } from './ticketmaster.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [TicketmasterController],
  providers: [TicketmasterService],
  exports: [TicketmasterService],
})
export class TicketmasterModule {}

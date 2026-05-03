import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TicketmasterService } from './ticketmaster.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { TicketmasterEventDto } from './dto/create-ticketmaster-event';

@Controller('ticketmaster')
export class TicketmasterController {
  constructor(private readonly ticketmasterService: TicketmasterService) {}

  @Post('create-ticketmaster-events')
    @UseGuards(JwtAuthGuard)
    createTicketmasterEvents(
      @Body() ticketmasterEventDto: TicketmasterEventDto,
    ) {
      return this.ticketmasterService.getEventsFromTicketmaster(
        ticketmasterEventDto.city, 
        ticketmasterEventDto.state, 
        ticketmasterEventDto.country);
    }
}

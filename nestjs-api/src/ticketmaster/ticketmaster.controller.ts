import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketmasterService } from './ticketmaster.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { TicketmasterEventDto } from './dto/create-ticketmaster-event';

@ApiTags('Ticketmaster')
@Controller('ticketmaster')
export class TicketmasterController {
  constructor(private readonly ticketmasterService: TicketmasterService) {}

  @ApiOperation({ summary: 'Import events from Ticketmaster' })
  @ApiResponse({ status: 201, description: 'Events imported successfully.' })
  @ApiBearerAuth()
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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { OwnerGuard } from 'src/guards/owner.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Get(':id/attendess')
  findAttendeesByEvent(@Param('id') id: string) {
    return this.eventsService.findAttendeesByEvent(id);
  }

  @Patch(':id')
  @UseGuards(OwnerGuard)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    console.log('Controller DTO:', updateEventDto);
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}

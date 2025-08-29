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
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get('my-events')
  @UseGuards(JwtAuthGuard)
  findByCreator(@Request() req) {
    return this.eventsService.findByCreatorId(req.user.id);
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
  @UseGuards(JwtAuthGuard)
  findAttendeesByEvent(@Param('id') id: string) {
    return this.eventsService.findAttendeesByEvent(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    console.log('Controller DTO:', updateEventDto);
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}

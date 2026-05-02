// src/events/events.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiParam, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { OwnerGuard } from 'src/guards/owner.guard';
import { CloudinaryStorageService } from './cloudinary-storage.service';
import { FileValidationPipe } from 'src/pipes/file-validation-pipe';
import { MulterOptions } from 'multer';

const multerOptions: MulterOptions = {
  storage: CloudinaryStorageService.createStorage('events'),
};

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Create a new event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateEventDto, description: 'Event data with optional image file' })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @UploadedFile(FileValidationPipe) file: any,
    @Body() createEventDto: CreateEventDto,
    @Request() req,
  ) {
    const imageUrl = file?.path || null;
    return this.eventsService.create(createEventDto, req.user.id, imageUrl);
  }

  @ApiOperation({ summary: 'Get all events created by the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of events created by the user.' })
  @ApiBearerAuth()
  @Get('my-events')
  @UseGuards(JwtAuthGuard)
  findByCreator(@Request() req) {
    return this.eventsService.findByCreatorId(req.user.id);
  }

  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'List of all events.' })
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @ApiOperation({ summary: 'Get events by city' })
  @ApiParam({ name: 'city', description: 'The city to filter events by' })
  @ApiResponse({ status: 200, description: 'List of events in the city.' })
  @Get('by-city/:city')
  findAllByCity(@Param('city') city: string) {
    return this.eventsService.findAllByCity(city);
  }

  @ApiOperation({ summary: 'Get an event by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the event' })
  @ApiResponse({ status: 200, description: 'The requested event.' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @ApiOperation({ summary: 'Get attendees for an event by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the event' })
  @ApiResponse({ status: 200, description: 'List of attendees.' })
  @ApiBearerAuth()
  @Get(':id/attendess')
  @UseGuards(JwtAuthGuard)
  findAttendeesByEvent(@Param('id') id: string) {
    return this.eventsService.findAttendeesByEvent(id);
  }

  @ApiOperation({ summary: 'Update an event by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateEventDto, description: 'Event data to update' })
  @ApiResponse({ status: 200, description: 'The event has been successfully updated.' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @UploadedFile(FileValidationPipe) file: any,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const imageUrl = file?.path || undefined;
    return this.eventsService.update(id, updateEventDto, imageUrl);
  }

  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the event' })
  @ApiResponse({ status: 200, description: 'The event has been successfully deleted.' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}

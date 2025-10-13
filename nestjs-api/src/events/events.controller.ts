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

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @UploadedFile(FileValidationPipe) file: any,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const imageUrl = file?.path || undefined;
    return this.eventsService.update(id, updateEventDto, imageUrl);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}

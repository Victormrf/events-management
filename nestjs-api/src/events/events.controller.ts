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

// Cria as opções do Multer usando o storage estático.
// Isso resolve o erro de 'this' pois não dependemos da injeção do NestJS neste ponto.
const multerOptions: MulterOptions = {
  // Chamamos o método createStorage de forma estática, que usa a inicialização global/estática do Cloudinary.
  storage: CloudinaryStorageService.createStorage('events'),
};

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  // Usa o FileInterceptor com as opções de Multer definidas estaticamente
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @UploadedFile(FileValidationPipe) file: any,
    @Body() createEventDto: CreateEventDto,
    @Request() req,
  ) {
    const imageUrl = file?.path || null; // Pega a URL do Cloudinary (req.file.path)
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
    const imageUrl = file?.path || undefined; // Pega a URL do Cloudinary, pode ser undefined
    return this.eventsService.update(id, updateEventDto, imageUrl);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}

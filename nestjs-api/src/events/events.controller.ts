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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { OwnerGuard } from 'src/guards/owner.guard';
import { CloudinaryStorageService } from './cloudinary-storage,service';
import { FileInterceptor } from '@nestjs/platform-express';

const storageFactory = (service: CloudinaryStorageService) =>
  service.createStorage('events');

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly cloudinaryStorageService: CloudinaryStorageService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storageFactory(new CloudinaryStorageService(null as any)),
    }),
  )
  create(
    @UploadedFile() file: any,
    @Body() createEventDto: CreateEventDto,
    @Request() req,
  ) {
    const imageUrl = (file as any)?.path || null;
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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storageFactory(new CloudinaryStorageService(null as any)),
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const imageUrl = (file as any)?.path || null;
    return this.eventsService.update(id, updateEventDto, imageUrl);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}

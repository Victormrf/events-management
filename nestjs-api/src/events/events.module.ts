import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryStorageService } from './cloudinary-storage.service';
import { GeocodingService } from 'src/geocoding/geocoding.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [EventsController],
  exports: [EventsService],
  providers: [EventsService, CloudinaryStorageService, GeocodingService],
})
export class EventsModule {}

import { Module } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { GeocodingController } from './geocoding.controller';
import { EventsModule } from 'src/events/events.module';
import { SeedModule } from 'src/seed/seed.module';
import { AiSeedService } from 'src/seed/seed.service';
import { EventsService } from 'src/events/events.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [GeocodingController],
  providers: [GeocodingService, AiSeedService, EventsService],
  exports: [GeocodingService],
  imports: [EventsModule, SeedModule, CloudinaryModule],
})
export class GeocodingModule {}

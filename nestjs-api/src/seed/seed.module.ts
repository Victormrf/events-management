import { Module } from '@nestjs/common';
import { AiSeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { EventsModule } from 'src/events/events.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [SeedController],
  providers: [AiSeedService],
  exports: [AiSeedService],
  imports: [EventsModule, CloudinaryModule],
})
export class SeedModule {}

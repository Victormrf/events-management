import { Module } from '@nestjs/common';
import { AiSeedService } from './seed.service';

@Module({
  providers: [AiSeedService],
})
export class SeedModule {}

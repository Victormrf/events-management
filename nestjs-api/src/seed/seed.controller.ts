import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AiSeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly aiSeedService: AiSeedService) {}

  @Get('listModels')
  async listModels() {
    await this.aiSeedService.listAvailableModels();
    return { message: 'Modelos listados no console.' };
  }

  @Post('generateSeedEvents')
  async generateSeedEvents(
    @Body() seedInput: { city: string; state: string; country: string },
  ) {
    const { city, state, country } = seedInput;
    console.log('Recebido seedInput:', seedInput);
    if (!city || !state || !country) {
      throw new BadRequestException(
        'Todos os campos de endereço são obrigatórios para a criação de eventos.',
      );
    }

    const newEvents = await this.aiSeedService.seedEventsForLocation(
      city,
      state,
      country,
    );

    if (!newEvents) {
      throw new BadRequestException(
        'Não foi possível encontrar as coordenadas para este endereço.',
      );
    }

    return newEvents;
  }
}

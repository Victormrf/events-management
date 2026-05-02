import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AiSeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly aiSeedService: AiSeedService) {}

  @ApiOperation({ summary: 'List available AI models' })
  @ApiResponse({ status: 200, description: 'Models listed successfully.' })
  @Get('listModels')
  async listModels() {
    await this.aiSeedService.listAvailableModels();
    return { message: 'Modelos listados no console.' };
  }

  @ApiOperation({ summary: 'Generate seed events for a location using AI' })
  @ApiBody({ schema: { type: 'object', properties: { city: { type: 'string' }, state: { type: 'string' }, country: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Seed events successfully generated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
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

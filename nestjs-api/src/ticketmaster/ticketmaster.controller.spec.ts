import { Test, TestingModule } from '@nestjs/testing';
import { TicketmasterController } from './ticketmaster.controller';
import { TicketmasterService } from './ticketmaster.service';

describe('TicketmasterController', () => {
  let controller: TicketmasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketmasterController],
      providers: [TicketmasterService],
    }).compile();

    controller = module.get<TicketmasterController>(TicketmasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

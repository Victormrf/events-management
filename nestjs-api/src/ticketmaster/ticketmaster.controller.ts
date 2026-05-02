import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketmasterService } from './ticketmaster.service';

@Controller('ticketmaster')
export class TicketmasterController {
  constructor(private readonly ticketmasterService: TicketmasterService) {}

  
}

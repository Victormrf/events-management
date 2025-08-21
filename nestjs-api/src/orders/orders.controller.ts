import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    try {
      return await this.ordersService.createOrder(
        req.user.id,
        createOrderDto.eventId,
        createOrderDto.attendees,
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(
        'Não foi possível processar a inscrição no evento.',
      );
    }
  }

  @Delete(':eventId')
  async cancelOrder(@Param('eventId') eventId: string, @Request() req) {
    const userId = req.user.id;
    return this.ordersService.cancelOrder(userId, eventId);
  }
}

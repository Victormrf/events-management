import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order for an event' })
  @ApiResponse({ status: 201, description: 'The order has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Conflict: user already registered or event is full.' })
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

  @ApiOperation({ summary: 'Get all orders for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user orders.' })
  @Get('/my-orders')
  async getUserOrders(@Request() req) {
    const userId = req.user.id;
    return this.ordersService.getUserOrders(userId);
  }

  @ApiOperation({ summary: 'Get an order by event ID for the authenticated user' })
  @ApiParam({ name: 'eventId', description: 'The ID of the event' })
  @ApiResponse({ status: 200, description: 'The order for the specified event.' })
  @Get('/event/:eventId')
  async getOrderByEvent(@Param('eventId') eventId: string, @Request() req) {
    const userId = req.user.id;
    return this.ordersService.getOrderByEventAndUser(userId, eventId);
  }

  @ApiOperation({ summary: 'Cancel an order for a specific event' })
  @ApiParam({ name: 'eventId', description: 'The ID of the event' })
  @ApiResponse({ status: 200, description: 'The order has been successfully cancelled.' })
  @Delete(':eventId')
  async cancelOrder(@Param('eventId') eventId: string, @Request() req) {
    const userId = req.user.id;
    return this.ordersService.cancelOrder(userId, eventId);
  }

  @ApiOperation({ summary: 'Change the status of an order' })
  @ApiParam({ name: 'eventId', description: 'The ID of the event' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: Object.values(OrderStatus) } } } })
  @ApiResponse({ status: 200, description: 'The order status has been successfully updated.' })
  @Patch('event/:eventId/change-status')
  async changeOrderStatus(
    @Param('eventId') eventId: string,
    @Request() req,
    @Body() body: { status: OrderStatus },
  ) {
    const userId = req.user.id;
    return this.ordersService.updateOrderStatus(userId, eventId, body.status);
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendeeDetailDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(
    userId: string,
    eventId: string,
    attendees: AttendeeDetailDto[],
  ) {
    const quantity = attendees.length;
    if (quantity < 1) {
      throw new BadRequestException(
        'Quantidade de inscrições deve ser no mínimo 1',
      );
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new BadRequestException('Evento não encontrado');
    }

    const totalAttendess = await this.prisma.order.aggregate({
      where: {
        eventId,
      },
      _sum: {
        quantity: true,
      },
    });

    const currentAttendees = totalAttendess._sum.quantity || 0;
    const newTotalAttendees = currentAttendees + quantity;

    if (event.maxAttendees !== null && newTotalAttendees > event.maxAttendees) {
      throw new ConflictException(
        `A quantidade total de inscrições disponíveis para este evento é ${event.maxAttendees - currentAttendees}.`,
      );
    }

    const eventPrice = new Prisma.Decimal(event.price.toString());
    const totalAmount = eventPrice.times(new Prisma.Decimal(quantity));

    // cria order
    const order = await this.prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        event: { connect: { id: eventId } },
        totalAmount: totalAmount.toNumber(),
        quantity,
        status: totalAmount.toNumber() > 0 ? 'PENDING' : 'CONFIRMED',
      },
    });

    // cria attendees
    const attendeesData = attendees.map((attendee) => ({
      ...attendee,
      orderId: order.id,
    }));

    await this.prisma.attendee.createMany({
      data: attendeesData,
    });

    return {
      message: 'Inscrição realizada com sucesso.',
      orderId: order.id,
      registeredAttendees: quantity,
    };
  }

  async getOrderByEventAndUser(userId: string, eventId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
      include: {
        event: { include: { address: true } },
        attendees: true,
      },
    });
    if (!order) {
      throw new NotFoundException('Usuário não inscrito neste evento.');
    }

    return order;
  }

  async cancelOrder(userId: string, eventId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
      include: {
        event: true,
      },
    });

    if (!order) {
      throw new NotFoundException(
        'Inscrição não encontrada para este usuário e evento.',
      );
    }

    if (new Date(order.event.date) < new Date()) {
      throw new BadRequestException(
        'Não é possível cancelar uma inscrição para um evento que já ocorreu.',
      );
    }

    await this.prisma.order.delete({
      where: {
        id: order.id,
      },
    });

    return { message: 'Inscrição cancelada com sucesso.' };
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        event: { include: { address: true } },
        attendees: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        'Nenhuma inscrição encontrada para este usuário',
      );
    }

    return orders;
  }

  async updateOrderStatus(
    userId: string,
    eventId: string,
    status: OrderStatus,
  ) {
    const order = await this.prisma.order.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });

    if (!order) {
      throw new NotFoundException(
        'Inscrição não encontrada para este usuário e evento.',
      );
    }
    if (order.status === 'CANCELED') {
      throw new BadRequestException(
        'Não é possível atualizar uma inscrição cancelada.',
      );
    }
    if (order.status === 'CONFIRMED' && status === 'PENDING') {
      throw new BadRequestException(
        'Não é possível reverter uma inscrição confirmada para pendente.',
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { status },
    });

    return updatedOrder;
  }
}

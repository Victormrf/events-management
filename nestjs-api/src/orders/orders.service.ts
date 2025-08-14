import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendeeDetailDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';

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

    console.log({
      user: userId,
      event: eventId,
      totalAmount: totalAmount.toNumber(),
      quantity,
    });

    // cria order
    const order = await this.prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        event: { connect: { id: eventId } },
        totalAmount: totalAmount.toNumber(),
        quantity,
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
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Attendee } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEventDto, creatorId: string) {
    return this.prisma.event.create({
      data: {
        ...data,
        date: new Date(data.date),
        maxAttendees: data.maxAttendees,
        price: data.price || 0.0,
        creator: {
          connect: { id: creatorId },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  async findAttendeesByEvent(id: string): Promise<Attendee[]> {
    const eventWithAttendees = await this.prisma.event.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            attendees: true,
          },
        },
      },
    });

    if (!eventWithAttendees) {
      throw new NotFoundException('Evento não encontrado');
    }

    return eventWithAttendees.orders.flatMap((order) => order.attendees);
  }

  async update(id: string, data: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}

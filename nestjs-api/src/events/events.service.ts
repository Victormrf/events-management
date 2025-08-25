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
        price: data.price !== undefined ? data.price.toFixed(2) : '0.00',
        creator: {
          connect: { id: creatorId },
        },
        address: {
          create: data.address, // Cria o endereço junto com o evento
        },
      },
    });
  }

  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        address: {
          select: {
            street: true,
            neighborhood: true,
            city: true,
            state: true,
            country: true,
            zipCode: true,
          },
        },
        creator: { select: { name: true, email: true } },
      },
    });

    if (!events) {
      throw new NotFoundException('Nenhum evento encontrado');
    }

    return events;
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }
    return event;
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

    if (eventWithAttendees.orders.length === 0) {
      throw new NotFoundException(
        'Nenhum participante encontrado para este evento',
      );
    }

    return eventWithAttendees.orders.flatMap((order) => order.attendees);
  }

  async update(id: string, data: UpdateEventDto) {
    console.log('Update data:', data);
    return this.prisma.event.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        price: data.price !== undefined ? data.price.toFixed(2) : undefined,
        ...(data.address && {
          address: {
            update: data.address,
          },
        }),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}

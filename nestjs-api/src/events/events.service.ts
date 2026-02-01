import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Attendee } from '@prisma/client';
import { CreateAddressDto } from './dto/create-address.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GeocodingService } from 'src/geocoding/geocoding.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private geocodingService: GeocodingService,
  ) {}

  async create(
    data: CreateEventDto,
    creatorId: string,
    imageUrl: string | null,
  ) {
    let addressObject: CreateAddressDto;

    try {
      addressObject = JSON.parse(data.address);
    } catch (e) {
      throw new BadRequestException(
        'O campo address deve ser um objeto JSON válido.' + e.message,
      );
    }

    const addressDtoInstance = plainToInstance(CreateAddressDto, addressObject);
    const errors = await validate(addressDtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap((error) =>
        Object.values(error.constraints || {}),
      );
      throw new BadRequestException([
        'Validação de endereço falhou.',
        ...errorMessages,
      ]);
    }

    const coords = await this.geocodingService.getCoordinates({
      street: addressObject.street,
      city: addressObject.city,
      state: addressObject.state,
      country: addressObject.country,
    });

    return this.prisma.event.create({
      data: {
        ...data,
        date: new Date(data.date),
        maxAttendees: data.maxAttendees,
        price: data.price !== undefined ? data.price.toFixed(2) : '0.00',
        image: imageUrl,
        creator: {
          connect: { id: creatorId },
        },
        address: {
          create: {
            ...addressObject,
            lat: coords?.lat || null,
            lng: coords?.lng || null,
          },
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
            lat: true,
            lng: true,
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

  async findByCreatorId(creatorId: string) {
    const events = await this.prisma.event.findMany({
      where: { creatorId },
      include: {
        address: true,
        creator: { select: { name: true, email: true } },
      },
      orderBy: { date: 'asc' },
    });

    if (!events || events.length === 0) {
      throw new NotFoundException('Nenhum evento encontrado para este criador');
    }

    return events;
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

  async update(id: string, data: UpdateEventDto, imageUrl: string | null) {
    let addressUpdateData: any = {};
    if (data.address && typeof data.address === 'string') {
      try {
        const parsedAddress = JSON.parse(data.address);

        const coords = await this.geocodingService.getCoordinates({
          street: parsedAddress.street,
          city: parsedAddress.city,
          state: parsedAddress.state,
          country: parsedAddress.country,
        });

        addressUpdateData = {
          address: {
            update: {
              ...parsedAddress,
              lat: coords?.lat || null,
              lng: coords?.lng || null,
            },
          },
        };
      } catch (e) {
        throw new BadRequestException(
          'O campo address deve ser um objeto JSON válido para atualização.' +
            e.message,
        );
      }
    }

    const imageUpdate = {
      image: imageUrl === null ? null : imageUrl,
    };

    return this.prisma.event.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        price: data.price !== undefined ? data.price.toFixed(2) : undefined,
        ...(imageUrl !== undefined && imageUpdate),
        ...addressUpdateData,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const eventId = request.params.id;

    if (user.role === Role.ADMIN) {
      // Se o usuário for admin, ele pode fazer a operação
      return true;
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new ForbiddenException('Acesso negado.');
    }

    // Se o usuário for o criador do evento, ele pode fazer a operação
    return event.creatorId === user.id;
  }
}

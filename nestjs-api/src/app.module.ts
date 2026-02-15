import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    UsersModule,
    EventsModule,
    PrismaModule,
    AuthModule,
    OrdersModule,
    GeocodingModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

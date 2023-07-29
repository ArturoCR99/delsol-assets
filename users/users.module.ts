import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Rol } from './entities/rol.entity';
import { Address } from './entities/address.entity';
import { PaymentMethod } from './entities/payment_method.entity';
import { PhoneNumber } from './entities/phone_number.entity';
import { BranchesModule } from 'src/branches/branches.module';
import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from 'src/orders/orders.module';
import { ImagesModule } from 'src/images/images.module';
import { ItemsModule } from 'src/items/items.module';
import { ClientController } from './client.controller';
import { ConfigRestaurant } from 'src/configs/entities/config.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    forwardRef(() => ItemsModule),
    forwardRef(() => BranchesModule),
    forwardRef(() => OrdersModule),
    NotificationsModule,
    JwtModule,
    ImagesModule,
    TypeOrmModule.forFeature([User, Rol, Address, PaymentMethod, PhoneNumber, ConfigRestaurant])
  ],
  controllers: [UsersController, ClientController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

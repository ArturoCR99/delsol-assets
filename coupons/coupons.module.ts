import { Module, forwardRef } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponToUser } from './entities/coupon_user.entity';
import { BranchesModule } from 'src/branches/branches.module';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { ToolsModule } from 'src/tools/tools.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon, CouponToUser]),
    forwardRef(() => UsersModule),
    BranchesModule,
    ItemsModule,
    ToolsModule
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService]
})
export class CouponsModule { }

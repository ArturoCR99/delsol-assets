import { ClassSerializerInterceptor, ConflictException, Controller, Get, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common';
import { ControllerInit } from 'src/tools/utils/controller_init_service';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('coupons')
export class CouponsController extends ControllerInit<Coupon, CreateCouponDto, UpdateCouponDto> {
  constructor(private readonly couponsService: CouponsService) {
    super(couponsService)
  }

  @Get()
  findAll(): Promise<Coupon[]> {
    return this.couponsService.findAll({relations: ["items", "branches"]})
  }

  @Post(':code/verify')
  async isValidCoupon(@Param("code") code: string) {
    const coupon = (await this.couponsService.findAll({ where: { code }, take: 1 })).pop()
    const isValid = this.couponsService.isValid(coupon)
    if (!isValid)
      throw new ConflictException("Invalid Coupon")
    return coupon
  }

  @Get('item/:item_id')
  async getCoupunsWithItem(
    @Param("item_id", ParseIntPipe) itemId: number
  ) {
    return this.couponsService.getCouponsWithItem(itemId)
  }

}

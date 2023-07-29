import { ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InitService } from 'src/tools/utils/init_service';
import { Coupon } from './entities/coupon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { BranchesService } from 'src/branches/branches.service';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { CouponBuilder, CouponDirector } from './builder/coupons.builder';
import { NotFoundError } from 'rxjs';
import { COUPON_CATEGORY, COUPON_TYPES } from './consts/coupons.const';
import { User } from 'src/users/entities/user.entity';
import { CouponToUser } from './entities/coupon_user.entity';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class CouponsService extends InitService<Coupon, CreateCouponDto> {

  public director: CouponDirector;
  public builder: CouponBuilder;

  constructor(
    @InjectRepository(Coupon)
    private _repository: Repository<Coupon>,
    @InjectRepository(CouponToUser)
    private _repositoryCouponToUser: Repository<CouponToUser>,

    private _branchService: BranchesService,

    @Inject(forwardRef(() => UsersService))
    private _userService: UsersService,
    private _itemService: ItemsService,
  ) {
    super(_repository)
    const [director, builder] = this._createDirector()
    this.director = director
    this.builder = builder
    this.director.setBuilder(this.builder)
  }

  async create(data: CreateCouponDto, ..._args: any): Promise<Coupon> {
    return this._repository.save(await this.director.buildCoupon(data))
  }

  async update(id: number, data: UpdateCouponDto): Promise<Coupon> {
    let coupon = await this.findOne(id)
    let updateCoupon = await this.director.updateCoupon(data as CreateCouponDto)
    let result = this._repository.merge(coupon, updateCoupon)
    await this._repository.save(result)
    return result
  }

  async getCouponsWithItem(itemId: number) {
    return (await this._itemService.findOne(itemId, { relations: ["coupons"] })).coupons
  }

  isValid(coupon: Coupon): boolean {
    const today = new Date()
    const endAt = new Date(coupon.endAt)
    return endAt > today
  }

  async canRedeem(coupon: Coupon, client: User, order: Order): Promise<boolean> {
    coupon = await this.findOne(coupon.id, { relations: ['branches', 'items', 'couponToUsers'] })
    client = await this._userService.findOne(client.id, { relations: ['branch'] })
    let couponUser: CouponToUser | undefined;

    // SI no se encuentra en la branch indicada
    if (!coupon.allBranches && !coupon.branches.some(b => b.id == order.branch.id)) {
      console.log("Incorrect branch")
      return false
    }

    if(!order.orderToItems.some(e => coupon.items.some(i => i.id === e.item.id))) {
      console.log("Incorrect item")
      return false
    }

    if (coupon.category == COUPON_CATEGORY.FOR_ITEM || coupon.category == COUPON_CATEGORY.FOR_TOTAL) {
      // Si no se enencutra en la lista de usuarios que ya hicieron el cupon crearlo
      couponUser = coupon.couponToUsers.find(e => e.client.id == client.id)
      if (couponUser == undefined) {
        couponUser = await this.appendClientToCouponUser(coupon, client)
      }
    } else if (coupon.category == COUPON_CATEGORY.BIRTHDAY) {
      couponUser = coupon.couponToUsers.find(e => e.client.id == client.id)
      if (couponUser == undefined) {
        return false
      }
    }

    // "Cobrarlo" solo si es menor o mayor la nueva suma
    couponUser.timesRedeemed += 1
    if (couponUser.timesRedeemed <= coupon.maxRedemptions) {
      await this._repositoryCouponToUser.save(couponUser)
      return true
    }
    return false
  }

  async appendClientToCouponUser(coupon: Coupon, client: User) {
    return await this._repositoryCouponToUser.save({
      client, coupon,
    })
  }

  async getByCode(code: string) {
    const coupon = (await this.findAll({ where: { code } })).pop() || null
    if (coupon == null) throw new NotFoundException("Coupon does not exists")
    return coupon
  }

  applyCoupon(coupon: Coupon, total: number) {
    const discount = coupon.type == COUPON_TYPES.PERCENTAGE ? total * (coupon.value / 100) : coupon.value
    return discount
  }

  async getValidBirthdayCoupons() {
    return await this.findAll({
      where: {
        endAt: LessThan(new Date()),
        startAt: MoreThanOrEqual(new Date()),
        category: COUPON_CATEGORY.BIRTHDAY
      }
    })
  }

  private _createDirector(): [CouponDirector, CouponBuilder] {
    const builder = new CouponBuilder(
      this._repository, this._branchService, this._itemService
    )
    const director = new CouponDirector()
    return [director, builder]
  }

}

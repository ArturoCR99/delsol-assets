import { Branch } from "src/branches/entities/branch.entity"
import { COUPON_CATEGORY, COUPON_TYPES } from "../consts/coupons.const"
import { Item } from "src/items/entities/item.entity"
import { Coupon } from "../entities/coupon.entity"
import { Repository, In } from 'typeorm';
import { ConflictException, NotFoundException } from "@nestjs/common"
import { CreateCouponBranchDto, CreateCouponDto, CreateCouponItemDto } from "../dto/create-coupon.dto"
import { BranchesService } from "src/branches/branches.service"
import { ItemsService } from "src/items/items.service"

export interface ICouponBuilder {

    setCode(code: string, update?: boolean): Promise<ICouponBuilder>
    setDescription(description: string): ICouponBuilder
    setType(type: COUPON_TYPES): ICouponBuilder
    setCategory(category: COUPON_CATEGORY): ICouponBuilder
    setValue(value: number): ICouponBuilder
    setMaxRedemtions(value: number): ICouponBuilder
    setDateRanges(startAt: Date, endAt: Date): ICouponBuilder
    setAllBranches(allBranches: boolean): ICouponBuilder
    setBranches(branches: CreateCouponBranchDto[]): Promise<ICouponBuilder>
    setItems(items: CreateCouponItemDto[]): Promise<ICouponBuilder>
    produce(): Coupon
    reset(): void

}

export class CouponBuilder implements ICouponBuilder {

    public coupon: Coupon
    constructor(
        private _repository: Repository<Coupon>,
        private _branchService: BranchesService,
        private _itemService: ItemsService
    ) {

    }
    setDescription(description: string): ICouponBuilder {
        this.coupon.description = description
        return this
    }

    async setCode(code: string, update: boolean = false): Promise<ICouponBuilder> {
        // Check if ciode already exists
        code = code.toUpperCase()
        const alreadyExists = await this._repository.findOne({ where: { code } })
        if (alreadyExists && !update) throw new ConflictException("Invalid code, not unique")
        this.coupon.code = code
        return this
    }
    setType(type: COUPON_TYPES): ICouponBuilder {
        this.coupon.type = type
        return this
    }
    setCategory(category: COUPON_CATEGORY): ICouponBuilder {
        this.coupon.category = category
        return this
    }
    setValue(value: number): ICouponBuilder {
        if (this.coupon.type === COUPON_TYPES.PERCENTAGE)
            if (value > 100.00) throw new ConflictException("Invalid value")
        this.coupon.value = value
        return this
    }
    setMaxRedemtions(maxRedemptions: number): ICouponBuilder {
        this.coupon.maxRedemptions = maxRedemptions
        return this
    }
    setDateRanges(startAt: Date, endAt: Date): ICouponBuilder {
        if (startAt > endAt) {
            const temp = startAt;
            startAt = endAt;
            endAt = temp;
        }
        this.coupon.startAt = startAt
        this.coupon.endAt = endAt
        return this
    }
    setAllBranches(allBranches: boolean): ICouponBuilder {
        this.coupon.allBranches = allBranches
        return this
    }
    async setBranches(branches?: CreateCouponBranchDto[]): Promise<ICouponBuilder> {
        if (branches == undefined || branches?.length === 0) {
            this.coupon.branches = []
            return this
        }
        const branchesId = branches.map(e => e.branch)
        const findedBranches = await this._branchService.findAll({ where: { id: In(branchesId) }, take: branches.length })
        if (findedBranches.length != branches.length)
            throw new NotFoundException("NOt all Items Finded")
        this.coupon.branches = findedBranches
        return this
    }
    async setItems(items?: CreateCouponItemDto[]): Promise<ICouponBuilder> {
        if (items == undefined || items?.length === 0) {
            this.coupon.items = []
            return this
        }

        const itemsId = items.map(e => e.item)
        const findedItems = await this._itemService.findAll({ where: { id: In(itemsId) }, take: items.length })
        if (findedItems.length != items.length)
            throw new NotFoundException("Not all items finded")
        this.coupon.items = findedItems
        return this
    }

    reset() {
        this.coupon = this._repository.create()
    }

    produce(): Coupon {
        const coupon = structuredClone(this.coupon)
        this.reset()
        return coupon
    }


}

export class CouponDirector {
    private builder: ICouponBuilder

    constructor() { }

    public setBuilder(builder: ICouponBuilder): void {
        this.builder = builder
    }

    public getBuilder() {
        return this.builder
    }

    public async buildCoupon(data: CreateCouponDto) {
        this.builder.reset()
        let builderTemp = (await this.builder.setCode(data.code))
            .setDescription(data.description)
            .setType(data.type)
            .setCategory(data.category)
            .setValue(data.value)
            .setDateRanges(data.startAt, data.endAt)
            .setAllBranches(data.allBranches)
            .setMaxRedemtions(data.maxRedemptions)

        if (data?.branches)
            builderTemp = await builderTemp.setBranches(data.branches)
        if (data?.items)
            builderTemp = await builderTemp.setItems(data.items)
        return builderTemp.produce()
    }

    public async updateCoupon(data: CreateCouponDto) {
        this.builder.reset()
        let builderTemp = (await this.builder.setCode(data.code, true))
            .setDescription(data.description)
            .setType(data.type)
            .setCategory(data.category)
            .setValue(data.value)
            .setDateRanges(data.startAt, data.endAt)
            .setAllBranches(data.allBranches)
            .setMaxRedemtions(data.maxRedemptions)
        let coupon = builderTemp.produce()
        if (data?.branches) {
            coupon.branches = data.branches.map(branch => {
                let i: Branch = new Branch();
                i.id = branch.branch
                return i
            })
        } else {
            coupon.branches = []
        }
        if (data?.items) {
            coupon.items = data.items.map(item => {
                let i: Item = new Item();
                i.id = item.item
                return i
            })
        } else {
            coupon.items = []
        }
        return coupon
    }
}
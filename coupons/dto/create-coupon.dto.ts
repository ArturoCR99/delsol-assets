import { IsArray, IsBoolean, IsDate, IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator"
import { COUPON_CATEGORY, COUPON_TYPES } from "../consts/coupons.const"
import { IsForeignKey } from "src/tools/classvalidators/foreign_key_validator"

export class CreateCouponDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    code: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsInt()
    @IsNotEmpty()
    @IsIn(Object.values(COUPON_TYPES))
    type: COUPON_TYPES

    @IsInt()
    @IsNotEmpty()
    @IsIn(Object.values(COUPON_CATEGORY))
    category: COUPON_CATEGORY

    @IsNumber()
    @IsNotEmpty()
    value: number

    @IsInt()
    @IsPositive()
    maxRedemptions: number

    @IsNotEmpty()
    @IsDateString()
    startAt: Date

    @IsNotEmpty()
    @IsDateString()
    endAt: Date

    @IsNotEmpty()
    @IsBoolean()
    allBranches: boolean

    @IsOptional()
    @IsArray()
    branches?: CreateCouponBranchDto[]

    @IsOptional()
    @IsArray()
    items?: CreateCouponItemDto[]
}

export class CreateCouponBranchDto {

    @IsForeignKey()
    branch: number

}

export class CreateCouponItemDto {
    @IsForeignKey()
    item: number
}

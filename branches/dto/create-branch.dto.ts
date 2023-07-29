import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, Length } from "class-validator"
import { IsForeignKey } from "src/tools/classvalidators/foreign_key_validator"
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '../enums/branch_option.enum';
import { CreateScheduleDTO, CreateScheduleWrapDTO } from "./create-branch-schedule.dto";

export class CreateBranchDto {

    @ApiProperty()
    @IsBoolean()
    active: boolean

    @ApiProperty()
    @IsString()
    @Length(1, 255)
    name: string

    @ApiProperty()
    @Length(7, 24)
    phone_number: string

    @ApiProperty()
    @IsString()
    @Length(1, 255)
    email: string

    @ApiProperty()
    @IsString()
    @Length(1, 255)
    @IsOptional()
    location: string

    @ApiProperty()
    @IsString()
    @Length(1, 255)
    address: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(1, 255)
    description: string

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @IsIn(Object.values(PAYMENT_OPTIONS))
    payment_option: number

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @IsIn(Object.values(DELIVERY_OPTIONS))
    delivery_option: number

    @ApiProperty()
    @IsOptional()
    @IsForeignKey()
    image: number

    @ApiProperty()
    @IsOptional()
    @IsArray()
    schedules?: CreateScheduleWrapDTO[]
}

import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString } from "class-validator";
import { IsForeignKey } from "src/tools/classvalidators/foreign_key_validator";
import { ROLS } from "../entities/rol.mock";

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    last_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDateString()
    birth_date: Date;

    @IsOptional()
    @IsForeignKey()
    image: number
    
    @IsOptional()
    @IsForeignKey()
    branch: number

    @ApiProperty()
    @IsOptional()
    rols: ROLS[]

}

export class CreateUserAddressDto {

    @IsString()
    @IsNotEmpty()
    address: string

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    priority: number
}

export class CreateUserPhoneNumberDto {

    @IsString()
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    priority: number
}

export class CreateUserBulkDto {
    users: CreateUserDto[]
}

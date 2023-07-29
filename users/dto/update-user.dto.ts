import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString } from "class-validator";
import { CreateUserDto } from './create-user.dto';
import { IsForeignKey } from 'src/tools/classvalidators/foreign_key_validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDateString()
    birth_date: Date;

    @IsOptional()
    @IsForeignKey()
    image: number
}

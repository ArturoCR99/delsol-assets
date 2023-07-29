import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { IsForeignKey } from 'src/tools/classvalidators/foreign_key_validator';

export class CreateItemDto {
  @ApiProperty()
  @IsBoolean()
  active: boolean;
  
  @ApiProperty()
  @IsBoolean()
  recommended: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsOptional()
  image: number;

  @ApiProperty()
  @IsForeignKey()
  category: number;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  branches: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tags: number[];
}

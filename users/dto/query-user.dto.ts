import { ParseIntPipe } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional } from "class-validator";
import { IsForeignKey } from "src/tools/classvalidators/foreign_key_validator";
import { ROLS } from "../entities/rol.mock";

@ApiTags("query")
export class QueryUserDto {

    @IsOptional()
    @ApiProperty()
    branch?: number;

    @IsOptional()
    @ApiProperty()
    roles?: ROLS[];
}
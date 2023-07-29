import { PartialType } from "@nestjs/swagger";
import { IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";
import { IsForeignKey } from "src/tools/classvalidators/foreign_key_validator";
import { CreateBranchDto } from "./create-branch.dto";

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
    @IsOptional()
    @Length(1, 255)
    name: string

    @IsOptional()
    @Length(7, 24)
    phone_number: string

    @IsOptional()
    @IsString()
    @Length(1, 255)
    email: string

    @IsOptional()
    @IsString()
    @Length(1, 255)
    address: string

    @IsOptional()
    @IsString()
    @Length(1, 255)
    description: string

    @IsOptional()
    @IsForeignKey()
    image: number
}


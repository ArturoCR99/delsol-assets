import { IsBoolean, IsDateString, IsIn, IsInt, IsNotEmpty, IsPositive, IsString, Matches } from "class-validator";
import { IsForeignKey } from "src/tools/classvalidators/foreign_key_validator";
import { WEEK } from "../enums/week_day.enum";

export class CreateScheduleDTO {
    @IsForeignKey()
    @IsNotEmpty()
    branch: number

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @IsIn(Object.values(WEEK))
    week_day: number

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|[2][0-3])\:([0-5]\d)\:([0-5]\d)$/, { message: "Invalid Opening time" })
    opening_time: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|[2][0-3])\:([0-5]\d)\:([0-5]\d)$/, { message: "Invalid Closing time" })
    closing_time: string
}

export class CreateScheduleWrapDTO {
    @IsBoolean()
    active: boolean;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @IsIn(Object.values(WEEK))
    week_day: number

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|[2][0-3])\:([0-5]\d)\:([0-5]\d)$/, { message: "Invalid Opening time" })
    opening_time: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|[2][0-3])\:([0-5]\d)\:([0-5]\d)$/, { message: "Invalid Closing time" })
    closing_time: string
}


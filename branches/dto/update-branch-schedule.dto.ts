import { PartialType } from "@nestjs/swagger";
import { CreateScheduleDTO } from "./create-branch-schedule.dto";

export class UpdateBranchScheduleDTO extends PartialType(CreateScheduleDTO) {

}
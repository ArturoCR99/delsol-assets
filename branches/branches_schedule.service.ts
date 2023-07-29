import { Injectable } from "@nestjs/common";
import { InitService } from "src/tools/utils/init_service";
import { Schedule } from "./entities/schedule.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Branch } from "./entities/branch.entity";
import { CreateScheduleDTO } from "./dto/create-branch-schedule.dto";

@Injectable()
export class SchedulesService extends InitService<Schedule, CreateScheduleDTO> {
    constructor(
        @InjectRepository(Schedule)
        private _scheduleRepository: Repository<Schedule>
    ) {
        super(_scheduleRepository)
    }
}
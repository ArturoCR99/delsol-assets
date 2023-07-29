import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SchedulesService } from './branches_schedule.service';
import { CreateScheduleDTO } from './dto/create-branch-schedule.dto';
import { UpdateBranchScheduleDTO } from './dto/update-branch-schedule.dto';

@ApiTags("Branches - Schedule")
@UseInterceptors(ClassSerializerInterceptor)
@Controller('schedules')
export class BranchesScheduleController {
    constructor(
        private readonly _scheduleService: SchedulesService,
    ) { }

    @Post()
    create(@Body() createBranchDto: CreateScheduleDTO) {
        return this._scheduleService.create(createBranchDto);
    }

    @Get()
    findAll() {
        return this._scheduleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this._scheduleService.findOne(+id, { relations: ['image'] });
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateBranchDto: UpdateBranchScheduleDTO) {
        return this._scheduleService.update(+id, updateBranchDto);
    }

    @Put(":id")
    toggleStatus(@Param("id", ParseIntPipe) id: number) {
        return this._scheduleService.toggle(+id)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: string) {
        return this._scheduleService.remove(+id);
    }


}

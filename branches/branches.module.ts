import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { ImagesModule } from 'src/images/images.module';
import { Schedule } from './entities/schedule.entity';
import { BranchesScheduleController } from './branches_schedule.controller';
import { SchedulesService } from './branches_schedule.service'; import { ToolsModule } from 'src/tools/tools.module';
;

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Schedule]),
    ImagesModule,
    ToolsModule
  ],
  controllers: [BranchesController, BranchesScheduleController],
  providers: [BranchesService, SchedulesService],
  exports: [BranchesService, SchedulesService, TypeOrmModule]
})
export class BranchesModule { }

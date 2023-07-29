import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InitService } from 'src/tools/utils/init_service';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Branch } from './entities/branch.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class BranchesService extends InitService<Branch, CreateBranchDto> {

  constructor(
    @InjectRepository(Branch)
    private _branchRepository: Repository<Branch>,
    @InjectRepository(Schedule)
    private _scheduleRepository: Repository<Schedule>
  ) {
    super(_branchRepository)
  }

  async create(data: CreateBranchDto) {
    const branch = this._branchRepository.create({
      name: data.name,
      location: data.location,
      phone_number: data.phone_number,
      address: data.address,
      email: data.email,
      description: data.description,
      payment_option: data.payment_option,
      delivery_option: data.delivery_option,
      image: data.image? {id:data.image}:null,
    })
    const createdBranch = await this._branchRepository.save(branch)
    createdBranch.schedules = []
    if (data?.schedules) {
      for (let schedule of data.schedules) {  
        let createdSchedule = await this._scheduleRepository.save({
          branch: {id: createdBranch.id},
          opening_time: schedule.opening_time,
          closing_time: schedule.closing_time,
          week_day: schedule.week_day,
          active: schedule.active,
        })
        createdBranch.schedules.push(createdSchedule)
      }
    }

    return createdBranch
  }

  async getCategories(id: number) {
    return await this.findOne(id, {
      select: [ 'id'],
      relations: ['categories'],
      where: {
        active: true,
      }
    })
  }

  async getItems(id: number) {
    return await this.findOne(id, {
      select: ['items', 'id'],
      relations: ['items'],
      where: {
        active: true,
      },
    }).then(e => {
      return e
    })
  }


}

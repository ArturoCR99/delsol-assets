import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, UseInterceptors, ClassSerializerInterceptor, Req, Put } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ImagesService } from 'src/images/images.service';
import { ApiTags } from '@nestjs/swagger';
import { ControllerInit } from 'src/tools/utils/controller_init_service';
import { Branch } from './entities/branch.entity';
import { SocketGateway } from 'src/tools/socket.gateway';
import { EVENTS, ROOMS } from 'src/tools/interfaces/socket.interface';

@ApiTags('Branches')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('branches')
export class BranchesController extends ControllerInit<Branch, CreateBranchDto, UpdateBranchDto> {
  constructor(
    private readonly branchesService: BranchesService,
    private _imagesService: ImagesService,
    private _gateway: SocketGateway
  ) {
    super(branchesService)
  }

  @Post()
  create(@Req() req: any, @Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  findAll() {
    return this.branchesService.findAll({ relations: ['image', 'schedules'], where: {active: true} });
  }

  @Get('admin')
  findAllAdmin() {
    return this.branchesService.findAll({ relations: ['image', 'schedules'] });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.findOne(+id, { relations: ['image', 'items'] });
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBranchDto: UpdateBranchDto, @Req() req: any) {
    return this.branchesService.update(+id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.remove(+id, (entity) => this._imagesService.remove(entity.image.id));
  }

  @Get(':id/categories')
  getCategories(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.getCategories(id)
  }

  @Get(':id/items')
  getItems(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.getItems(id)
  }

  @Get(':id/categories-items')
  async getCategoriesAndItems(@Param('id', ParseIntPipe) id: number) {
    return {
      items: await this.branchesService.getItems(id),
      categories: await this.branchesService.getCategories(id),
    }
  }

  @Put(':id/toggle')
  async toggle(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.toggle(+id).then(e => {
      this._gateway.server.in(ROOMS.CUSTOMER).emit(EVENTS.BRANCH)
      return e
    });
  }

  @Put(':id/disable')
  async disable(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.disable(+id).then(e => {
      this._gateway.server.in(ROOMS.CUSTOMER).emit(EVENTS.BRANCH)
      return e
    });
  }

  @Put(':id/enable')
  async enable(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.enable(+id).then(e => {
      this._gateway.server.in(ROOMS.CUSTOMER).emit(EVENTS.BRANCH)
      return e
    });
  }
}

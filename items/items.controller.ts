import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors, ParseIntPipe, Req } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ImagesService } from 'src/images/images.service';
import { ApiTags } from '@nestjs/swagger';
import { ControllerInit } from 'src/tools/utils/controller_init_service';
import { Item } from './entities/item.entity';

@ApiTags('Items')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('items')
export class ItemsController extends ControllerInit<Item, CreateItemDto, UpdateItemDto> {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly imagesService: ImagesService,
  ) {
    super(itemsService)
  }

  @Post()
  create(@Req() req: any, @Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll({ relations: ['image'] });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(+id, {
      relations: ['image', 'addonTypes', 'addonTypes.addons', 'category'],
    });
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateItemDto: UpdateItemDto, @Req() req: any,) {
    console.log(updateItemDto)
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.remove(+id, (entity) => this.imagesService.remove(entity.image.id));
  }

  @Get('recommended/client')
  getRecommended() {
    return this.itemsService.getRecommended();
  }
}

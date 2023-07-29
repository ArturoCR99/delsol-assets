import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InitService } from 'src/tools/utils/init_service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { TagsService } from 'src/tags/tags.service';
import { AddonsService } from 'src/addons/addons.service';
import { CategoriesService } from 'src/categories/categories.service';
import { BranchesService } from 'src/branches/branches.service';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class ItemsService extends InitService<Item, CreateItemDto> {
  constructor(
    @InjectRepository(Item)
    private _itemRepository: Repository<Item>,
    private _tagService: TagsService,
    private _addonService: AddonsService,
    private _categoryService: CategoriesService,
    private _branchesService: BranchesService,
    private _imageService: ImagesService,
  ) {
    super(_itemRepository);
  }

  public async create(data: CreateItemDto): Promise<Item> {
    try {
      const item = this._itemRepository.create();
      item.name = data.name;
      item.description = data.description;
      item.price = data.price;
      item.active = data.active;
      item.image = data.image
        ? await this._imageService.findOne(data.image)
        : null;
      item.recommended = data.recommended;
      item.category = await this._categoryService.findOne(data.category);
      item.branches = data?.branches
        ? await this._branchesService.findAll({
            where: { id: In(data.branches) },
          })
        : [];
      item.tags = data?.tags
        ? await this._tagService.findAll({ where: { id: In(data.tags) } })
        : [];

      return this._itemRepository.save(item);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string | number, data: UpdateItemDto) {
    return this._itemRepository.manager.transaction(async (manager) => {
      let entity = await this.findOne(id);
      const updateEntity = this._itemRepository.merge(entity, {
        name: data.name,
        description: data.description,
        price: data.price,
        active: data.active,
        recommended: data.recommended,
        image: data.image ? await this._imageService.findOne(data.image) : null,
        branches: data?.branches?.length
          ? await this._branchesService.findAll({
              where: { id: In(data.branches) },
            })
          : [],
        tags: data?.tags.length
          ? await this._tagService.findAll({ where: { id: In(data.tags) } })
          : [],
      });

      return manager.save(updateEntity);
    });
  }

  async getRecommended() {
    return this._itemRepository.find({
      where: { recommended: true },
      relations: ['image', 'category'],
    });
  }
}

import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ImagesModule } from 'src/images/images.module';
import { TagsModule } from 'src/tags/tags.module';
import { AddonsModule } from 'src/addons/addons.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { BranchesModule } from 'src/branches/branches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    ImagesModule,
    TagsModule,
    AddonsModule,
    CategoriesModule,
    BranchesModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService, TypeOrmModule]
})
export class ItemsModule { }

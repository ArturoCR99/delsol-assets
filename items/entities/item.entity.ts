import { AddonType } from "src/addons/entities/addon_type.entity";
import { Branch } from "src/branches/entities/branch.entity";
import { Category } from "src/categories/entities/category.entity";
import { Coupon } from "src/coupons/entities/coupon.entity";
import { EntityBaseImage } from "src/images/utils/image_col";
import { OrderToItem } from "src/orders/entities/order_item_addon.entity";
import { PromotionToItem } from "src/promotions/entities/promotion_item.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { DecimalTransformer } from "src/tools/transformers/ocurrency.transformers";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Item extends EntityBaseImage {

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    description: string;

    @Column({ type: "decimal", precision: 12, scale: 2, nullable: false, transformer: new DecimalTransformer() })
    price: number;

    @OneToMany(() => OrderToItem, (orderToItem) => orderToItem.item)
    orderToItems: OrderToItem[]

    @OneToMany(() => PromotionToItem, (promotionToItem) => promotionToItem.item)
    promotionToItems: PromotionToItem[]

    @ManyToMany(() => Branch, (branch) => branch.items)
    @JoinTable()
    branches: Branch[]

    @ManyToOne(() => Category, (category) => category.items)
    category: Category

    @ManyToMany(() => Tag, (tag) => tag.items,)
    @JoinTable()
    tags: Tag[]

    @OneToMany(() => AddonType, (addonType) => addonType.item)
    addonTypes: AddonType[]

    @ManyToMany(() => Coupon)
    coupons: Coupon[]


    @Column({default:false,type:"boolean"})
    recommended: boolean;
}

import { Branch } from "src/branches/entities/branch.entity";
import { Item } from "src/items/entities/item.entity";
import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { COUPON_CATEGORY, COUPON_TYPES } from "../consts/coupons.const";
import { CouponToUser } from "./coupon_user.entity";
import { DecimalTransformer } from "src/tools/transformers/ocurrency.transformers";
import { DateTransformer } from "src/tools/transformers/date.transformers";

@Entity()
export class Coupon {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number

    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    code: string

    @Column({ type: "text", default: "a coupon", nullable: false })
    description: string

    @Column({ type: "smallint", unsigned: true, nullable: false, default: COUPON_CATEGORY.FOR_ITEM })
    category: COUPON_CATEGORY;

    @Column({ type: 'smallint', unsigned: true, nullable: false })
    type: COUPON_TYPES

    @Column({ type: "decimal", precision: 12, scale: 2, nullable: false, default: 1, transformer: new DecimalTransformer() })
    value: number;

    @Column({ type: 'smallint', unsigned: true, nullable: false })
    maxRedemptions: number

    @Column({ type: 'date', nullable: false })
    startAt: Date

    @Column({ type: 'date', nullable: false })
    endAt: Date

    @Column({ type: 'boolean', nullable: false })
    allBranches: boolean

    @OneToMany(() => CouponToUser, couponUser => couponUser.coupon)
    couponToUsers: CouponToUser[]

    @OneToMany(() => Order, order => order.coupon)
    orders: Order[]

    @ManyToMany(() => Branch)
    @JoinTable()
    branches: Branch[]

    @ManyToMany(() => Item)
    @JoinTable()
    items: Item[]
}

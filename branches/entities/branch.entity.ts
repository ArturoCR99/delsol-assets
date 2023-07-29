import { Category } from "src/categories/entities/category.entity";
import { ConfigRestaurant } from "src/configs/entities/config.entity";
import { Coupon } from "src/coupons/entities/coupon.entity";
import { EntityBaseImage } from "src/images/utils/image_col";
import { Item } from "src/items/entities/item.entity";
import { Order } from "src/orders/entities/order.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '../enums/branch_option.enum';
import { Schedule } from "./schedule.entity";


@Entity()
export class Branch extends EntityBaseImage {

    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    location: string

    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    email: string;

    @Column({ type: "varchar", length: 13, nullable: false, unique: true })
    phone_number: string;


    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    address: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    description: string;

    @Column({ type: "smallint", unsigned: true, nullable: false, default: 1 })
    payment_option: PAYMENT_OPTIONS

    @Column({ type: "smallint", unsigned: true, nullable: false, default: 1 })
    delivery_option: DELIVERY_OPTIONS

    @ManyToMany(() => Item, (item) => item.branches)
    items: Item[]

    @ManyToMany(() => Coupon, coupon => coupon.branches)
    coupons: Coupon[]

    @OneToMany(() => User, (user) => user.branch)
    users: User[]

    @OneToMany(() => Schedule, (schedule) => schedule.branch, { eager: true })
    schedules: Schedule[]

    @OneToMany(() => Order, (order) => order.branch)
    orders: Order[]

    @OneToOne(() => ConfigRestaurant, { eager: true })
    @JoinColumn()
    config: ConfigRestaurant


}


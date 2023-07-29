import { Exclude } from "class-transformer";
import { Branch } from "src/branches/entities/branch.entity";
import { CouponToUser } from "src/coupons/entities/coupon_user.entity";
import { EntityBaseImage } from "src/images/utils/image_col";
import { Item } from "src/items/entities/item.entity";
import { Notification } from "src/notifications/entities/notification.entity";
import { Order } from "src/orders/entities/order.entity";
import { DecimalTransformer } from "src/tools/transformers/ocurrency.transformers";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { Address } from "./address.entity";
import { PaymentMethod } from "./payment_method.entity";
import { PhoneNumber } from "./phone_number.entity";
import { ROLS } from "./rol.mock";

@Entity()
export class User extends EntityBaseImage {

    @Column({ type: "varchar", nullable: false })
    name: string

    @Column({ type: "varchar", nullable: false })
    last_name: string

    @Column({ type: "varchar", unique: true, nullable: false })
    email: string

    @Column({ type: "varchar", nullable: true })
    @Exclude()
    password: string

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0, transformer: new DecimalTransformer() })
    wallet: number

    @Column({ type: "boolean", nullable: false, default: true })
    notifications_enabled: boolean

    @Column({ type: "date", nullable: true })
    birth_date: Date

    @Column({ type: "varchar", nullable: true })
    mobileToken?: string

    @Column({type: 'simple-array', enum: ROLS, default: ROLS.CUSTOMER})
    rols: ROLS[]

    @ManyToMany(() => Item, { onDelete: "CASCADE" })
    @JoinTable()
    favorites: Item[]

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[]

    @OneToMany(() => CouponToUser, couponUser => couponUser.client)
    couponToUsers: number

    @OneToMany(() => PhoneNumber, (phone_number) => phone_number.user, { eager: true })
    phone_numbers: PhoneNumber[]

    @OneToMany(() => Address, (address) => address.user, { eager: true })
    addresses: Address[]

    @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
    payment_methods: PaymentMethod[]

    @OneToMany(() => Order, (order) => order.client)
    orders: Order[]

    @ManyToOne(() => Branch, (branch) => branch.users, { onDelete: "SET NULL", nullable: true })
    branch: Branch
}

import { EntityBase } from "src/tools/entityBase";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Order } from "src/orders/entities/order.entity";

@Entity()
export class PaymentMethod extends EntityBase {
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    stripe_payment_method_id: string;

    @Column({ type: "varchar", nullable: false })
    card_type: string

    @Column({ type: "smallint", nullable: false, default: 1 })
    priority: number;

    @ManyToOne(() => User, (user) => user.payment_methods, { onDelete: "CASCADE" })
    user: User

    @OneToMany(() => Order, (order) => order.payment_method)
    orders: Order[]
}
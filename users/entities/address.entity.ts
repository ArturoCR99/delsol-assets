import { EntityBase } from "src/tools/entityBase";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Order } from "src/orders/entities/order.entity";

@Entity()
export class Address extends EntityBase {

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    address: string;

    @Column({ type: "smallint", nullable: false, default: 1 })
    priority: number;

    @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
    user: User

    @OneToMany(() => Order, (order) => order.address)
    orders: Order[]

}
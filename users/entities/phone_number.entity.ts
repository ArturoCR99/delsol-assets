import { EntityBase } from "src/tools/entityBase";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PhoneNumber extends EntityBase {

    @Column({ type: "varchar", nullable: false, length: 13 })
    phone: string;

    @Column({ type: "smallint", nullable: false, default: 1 })
    priority: number;

    @ManyToOne(() => User, (user) => user.phone_numbers, { onDelete: "CASCADE" })
    user: User
}
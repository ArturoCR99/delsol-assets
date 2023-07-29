import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Coupon } from "./coupon.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class CouponToUser {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number

    @Column({ type: "smallint", unsigned: true, nullable: false, default: 0 })
    timesRedeemed: number

    @ManyToOne(() => Coupon, coupon => coupon.couponToUsers, { onDelete: "CASCADE" })
    coupon: Coupon

    @ManyToOne(() => User, user => user.couponToUsers, { eager: true, onDelete: "CASCADE" })
    client: User

}
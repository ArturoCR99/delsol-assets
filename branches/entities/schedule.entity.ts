import { EntityBase } from "src/tools/entityBase";
import { BeforeInsert, Column, Entity, ManyToOne } from "typeorm";
import { WEEK } from "../enums/week_day.enum";
import { Branch } from "./branch.entity";

@Entity()
export class Schedule extends EntityBase {

    @Column({ type: "smallint", unsigned: true, nullable: false, default: WEEK.MONDAY })
    week_day: WEEK

    @Column({ type: "time", nullable: false })
    opening_time: string

    @Column({ type: "time", nullable: false })
    closing_time: string

    @ManyToOne(() => Branch, (branch) => branch.schedules, { onDelete: "CASCADE" })
    branch: Branch

    @BeforeInsert()
    validateDates() {
        if (this.opening_time == this.closing_time)
            throw new Error("Same date")
        if (this.opening_time > this.closing_time) {
            const temp = this.opening_time
            this.opening_time = this.closing_time
            this.closing_time = temp
        }
    }
}
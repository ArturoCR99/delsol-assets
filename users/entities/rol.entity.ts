import { EntityBase } from "src/tools/entityBase";
import { Column, Entity } from "typeorm";
import { ROLS } from "./rol.mock";

@Entity()
export class Rol extends EntityBase {

    @Column({ type: "smallint", nullable: true, unique: true })
    rol: ROLS
}


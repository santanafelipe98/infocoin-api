import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Condition } from "./condition.entity";

@Entity("condition_types")
export class ConditionType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    description: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => Condition, (condition: Condition) => condition.type)
    conditions: Condition[];
}
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { ConditionType } from "./condition-type.entity";
import { Alert } from "./alert.entity";

@Entity("conditions")
export class Condition {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({  name: "updated_at" })
    updatedAt: Date;

    @Column()
    value: string;

    @RelationId((condition: Condition) => condition.conditionType, "condition_type_id")
    conditionTypeId: number;

    @JoinColumn({
        name: "condition_type_id",
        referencedColumnName: "id"
    })
    @ManyToOne(() => ConditionType, (conditionType: ConditionType) => conditionType.conditions)
    conditionType: Condition;

    @OneToOne(() => Alert, (alert: Alert) => alert.whereCondition)
    alert: Alert;
}
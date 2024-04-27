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

    @RelationId((condition: Condition) => condition.type)
    typeId: number;

    @JoinColumn({
        name: "condition_type_id"
    })
    @ManyToOne(() => ConditionType, (conditionType: ConditionType) => conditionType.conditions)
    type: ConditionType;

    @RelationId((condition: Condition) => condition.alert)
    alertId: number;

    @JoinColumn({
        name: "alert_id"
    })
    @OneToOne(() => Alert, (alert: Alert) => alert.condition, {
        onDelete: 'CASCADE'
    })
    alert: Alert;
}
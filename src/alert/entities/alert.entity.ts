import { User } from "../../user/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn
} from "typeorm";
import { Condition } from "./condition.entity";

@Entity("alerts")
export class Alert {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @Column({ type: "timestamp", nullable: true, name: "triggered_at" })
    triggeredAt: Date;

    @RelationId((alert: Alert) => alert.user)
    userId: string;

    @JoinColumn({
        name: "user_id"
    })
    @ManyToOne(() => User, (user: User) => user.alerts)
    user: User;

    @RelationId((alert: Alert) => alert.whereCondition)
    whereConditionId: number;

    @JoinColumn({
        name: "where_condition"
    })
    @OneToOne(() => Condition, (condition: Condition) => condition.alert)
    whereCondition: Condition;
}
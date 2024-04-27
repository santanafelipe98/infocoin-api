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
import { Coin } from "src/coin/entities/coin.entity";

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

    @RelationId((alert: Alert) => alert.coin)
    coinId: string;

    @JoinColumn({ name: "coin_id" })
    @ManyToOne(() => Coin, (coin: Coin) => coin.alerts)
    coin: Coin;

    @OneToOne(() => Condition, (condition: Condition) => condition.alert, { cascade: true })
    condition: Condition;
}
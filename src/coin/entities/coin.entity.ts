import { Alert } from "src/alert/entities/alert.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("coins")
export class Coin {
    @PrimaryColumn({ generated: false })
    id: string;

    @Column()
    symbol: string;

    @Column()
    name: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => Alert, (alert: Alert) => alert.coin)
    alerts: Alert[];
}
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

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
}
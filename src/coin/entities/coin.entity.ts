import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("coins")
export class Coin {
    @PrimaryColumn({ generated: false })
    id: string;

    @Column()
    symbol: string;

    @Column()
    name: string;
}
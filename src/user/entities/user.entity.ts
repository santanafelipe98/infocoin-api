import { Exclude } from "class-transformer";
import { Alert } from "src/alert/entities/alert.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

export class Name {
    @Column({ name: "first_name" })
    first: string;

    @Column({ name: "last_name" })
    last: string;
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: string;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: string;

    @Column(() => Name, { prefix: false })
    name: Name;

    @Column()
    email: string;
    
    @Column({ name: "password_hash" })
    @Exclude({ toPlainOnly: true })
    passwordHash: string;

    @Column({ type: "timestamp",  nullable: true, name: "verified_at" })
    verifiedAt: Date;

    @OneToMany(() => Alert, (alert: Alert) => alert.user)
    alerts: Alert[];
}
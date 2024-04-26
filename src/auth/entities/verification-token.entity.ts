import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId
} from "typeorm";

import { User } from "../../user/entities/user.entity";

@Entity("verification_tokens")
export class VerificationToken {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @Column({
        type: "timestamp",
        name: "expires_at"
    })
    expiresAt: Date;

    @Column()
    @Generated("uuid")
    token: string;

    @RelationId((token: VerificationToken) => token.user)
    userId: string;
    
    @JoinColumn()
    @ManyToOne(() => User, (user: User) => user.verificationTokens, {
        onDelete: 'CASCADE',
        cascade: true
    })
    user: User;
}
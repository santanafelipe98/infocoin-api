import { User } from "src/user/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId
} from "typeorm";

@Entity("password_reset_tokens")
export class PasswordResetToken {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @Column({ type: "timestamp", name: "expires_at" })
    expiresAt: Date;

    @Column()
    token: string;

    @RelationId((token: PasswordResetToken) => token.user)
    userId: string; 

    @JoinColumn()
    @ManyToOne(() => User, (user: User) => user.passwordResetTokens, {
        onDelete: 'CASCADE',
        cascade: true
    })
    user: User;
}
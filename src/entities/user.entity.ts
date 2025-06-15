import { UserRole } from '../modules/user/user.enum';
import {
    Entity,
    Column,
    BeforeInsert,
    BeforeUpdate,
    OneToMany,
} from 'typeorm';
import { Entities } from './entity.enum';
import { BaseEntity } from './base.enitity';
import * as bcrypt from 'bcrypt';
import { Document } from './document.entity';

@Entity(Entities.USER)
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 256 })
    name: string;

    @Column({ type: 'varchar', length: 256, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 256 })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.VIEWER,
    })
    role: UserRole;

    @OneToMany(() => Document, (doc) => doc.uploadedBy)
    documents: Document[];

    // Hash password before insert or update via hooks
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
    }
}

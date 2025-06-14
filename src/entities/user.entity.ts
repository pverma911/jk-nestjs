import { UserRole } from 'src/modules/user/user.enum';
import {
    Entity,
    Column,
} from 'typeorm';
import { Entities } from './entity.enum';
import { BaseEntity } from './base.enitity';

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
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.enitity';

@Entity()
export class Document extends BaseEntity {
    @Column()
    filename: string;

    @Column()
    originalName: string;

    @Column()
    mimetype: string;

    @Column()
    size: number;

    @Column()
    path: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => User, (user) => user.documents)
    uploadedBy: User;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.enitity';
import { IngestionStatus } from 'src/modules/ingestion/ingestion.enum';

@Entity()
export class Document extends BaseEntity {
    @Column()
    filename: string;

    @Column({ name: "original_name" })
    originalName: string;

    @Column()
    mimetype: string;

    @Column()
    size: number;

    @Column()
    path: string;

    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: IngestionStatus,
        default: IngestionStatus.PENDING,
        name: "ingestion_status"
    })
    ingestionStatus: IngestionStatus;

    @Column({ name: "ingestion_started_at", type: 'timestamp', nullable: true })
    ingestionStartedAt?: Date;

    @Column({ name: "ingestion_ended_at", type: 'timestamp', nullable: true })
    ingestionCompletedAt?: Date;

    @Column({ name: "ingestion_retry_count", default: 0 })
    ingestionRetryCount: number;

    @ManyToOne(() => User, (user) => user.documents)
    @JoinColumn({ name: 'uploaded_by' })
    uploadedBy: User;
}

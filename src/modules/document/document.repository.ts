import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Document } from '../../entities/document.entity';

/**
 * Document Repository
 */
@Injectable()
export class DocumentRepository extends Repository<Document> {
    constructor (private dataSource: DataSource) {
        super(Document, dataSource.createEntityManager());
    }

    async findAllByUserId(userId: string) {
        return await this.find({ where: { uploadedBy: { id: userId } } });
    }

    async findById(id: string) {
        return await this.findOne({ where: { id } })
    }
}

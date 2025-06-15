import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Document } from 'src/entities/document.entity';

/**
 * Document Repository
 */
@Injectable()
export class DocumentRepository extends Repository<Document> {
    constructor (private dataSource: DataSource) {
        super(Document, dataSource.createEntityManager());
    }
}

import { HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ResponseService } from 'src/utils/response.utils';
import { DocumentRepository } from '../document/document.repository';
import { IngestionStatus } from './ingestion.enum';
import { Document } from 'src/entities/document.entity';

@Injectable()
export class IngestionService extends ResponseService {
    constructor (private readonly documentRepo: DocumentRepository) { super() }

    async triggerIngestion(docId: string) {
        const doc = await this.documentRepo.findById(docId)
        if (!doc) throw new NotFoundException('Document not found');

        if (doc.ingestionStatus === IngestionStatus.COMPLETED) {
            throw new UnprocessableEntityException("Document is already successfuly ingested")
        }

        doc.ingestionStatus = IngestionStatus.PROCESSING;
        doc.ingestionStartedAt = new Date();
        await this.documentRepo.save(doc);

        // Simulate processing
        this.simulateIngestion(doc)

        return this.serviceResponse(HttpStatus.OK, { status: doc.ingestionStatus }, "Ingestion Started");
    }

    async getStatus(docId: string) {
        const doc = await this.documentRepo.findOneBy({ id: docId });
        if (!doc) throw new NotFoundException('Document not found');

        return this.serviceResponse(HttpStatus.OK, {
            docId: doc.id,
            status: doc.ingestionStatus,
            startedAt: doc.ingestionStartedAt,
            completedAt: doc.ingestionCompletedAt,
        }, "Ingestion Status");
    }

    private async simulateIngestion(doc: Document, attempt = 1) {
        const MAX_RETRIES = 3;

        setTimeout(async () => {
            const isSuccess = Math.random() > 0.5;

            if (isSuccess) {
                doc.ingestionStatus = IngestionStatus.COMPLETED;
                doc.ingestionCompletedAt = new Date();
                console.log(`ingestion for doc ${doc.id}, sucessful`);

            } else {
                doc.ingestionRetryCount = attempt;
                if (attempt < MAX_RETRIES) {
                    console.log(`Retrying ingestion for doc ${doc.id}, attempt ${attempt + 1}`);
                    await this.documentRepo.save(doc);
                    this.simulateIngestion(doc, attempt + 1);
                    return;
                } else {
                    doc.ingestionStatus = IngestionStatus.FAILED;
                    doc.ingestionCompletedAt = new Date();
                }
            }

            await this.documentRepo.save(doc);
        }, 6000);
    }

}

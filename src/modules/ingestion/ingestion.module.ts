import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { DocumentRepository } from '../document/document.repository';

@Module({
  imports: [],
  controllers: [IngestionController],
  providers: [IngestionService, DocumentRepository],
})
export class IngestionModule { }

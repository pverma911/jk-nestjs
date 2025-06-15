import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { DocumentRepository } from './document.repository';
import { Document } from 'src/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), UserModule],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository],
})
export class DocumentModule { }

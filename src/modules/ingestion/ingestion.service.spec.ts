import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { DocumentRepository } from '../document/document.repository';
import { IngestionStatus } from './ingestion.enum';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Document } from 'src/entities/document.entity';

describe('IngestionService', () => {
  let service: IngestionService;

  const mockRepo = {
    findById: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: DocumentRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('triggerIngestion', () => {
    it('should throw if doc not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.triggerIngestion('e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb')).rejects.toThrow(NotFoundException);
    });

    it('should throw if already completed', async () => {

      const doc = {
        "id": "e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb",
        "created_at": "2025-06-15T12:51:48.260Z",
        "updated_at": "2025-06-15T13:29:42.414Z",
        "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "originalName": "Notification Service doc -Pi42.pdf",
        "mimetype": "application/pdf",
        "size": 64790,
        "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "description": "random doc",
        "ingestionStatus": "completed",
        "ingestionStartedAt": null,
        "ingestionCompletedAt": null,
        "ingestionRetryCount": 0
      }
      mockRepo.findById.mockResolvedValue(doc);

      await expect(service.triggerIngestion('e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb')).rejects.toThrow(UnprocessableEntityException);
    });

    it('should update and simulate ingestion', async () => {
      const doc: any = {
        "id": "e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb",
        "created_at": "2025-06-15T12:51:48.260Z",
        "updated_at": "2025-06-15T13:29:42.414Z",
        "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "originalName": "Notification Service doc -Pi42.pdf",
        "mimetype": "application/pdf",
        "size": 64790,
        "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "description": "random doc",
        "ingestionStatus": "pending",
        "ingestionStartedAt": null,
        "ingestionCompletedAt": null,
        "ingestionRetryCount": 0
      }
      mockRepo.findById.mockResolvedValue(doc);

      doc.ingestionStatus = IngestionStatus.PROCESSING;
      doc.ingestionStartedAt = "2025-06-15T12:51:48.260Z";

      mockRepo.save.mockResolvedValue(doc);

      const result = {
        "statusCode": 200,
        "success": true,
        "message": "Ingestion Started",
        "data": {
          "status": "processing"
        }
      }

      const response = await service.triggerIngestion('e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb');

      expect(mockRepo.save).toHaveBeenCalledWith(doc);
      expect(response).toEqual(result);
      expect(result.data.status).toBe(IngestionStatus.PROCESSING);
      expect(result.statusCode).toBe(200);
    });
  });

  describe('getStatus', () => {
    it('should throw if doc not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.getStatus('e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb')).rejects.toThrow(NotFoundException);
    });

    it('should return status of the document', async () => {
      const doc = {
        "id": "e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb",
        "created_at": "2025-06-15T12:51:48.260Z",
        "updated_at": "2025-06-15T13:29:42.414Z",
        "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "originalName": "Notification Service doc -Pi42.pdf",
        "mimetype": "application/pdf",
        "size": 64790,
        "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "description": "random doc",
        "ingestionStatus": "completed",
        "ingestionStartedAt": null,
        "ingestionCompletedAt": null,
        "ingestionRetryCount": 0
      }

      const response = {
        "statusCode": 200,
        "success": true,
        "message": "Ingestion Status",
        "data": {
          "docId": doc.id,
          "status": doc.ingestionStatus,
          "startedAt": doc.ingestionStartedAt,
          "completedAt": doc.ingestionCompletedAt
        }
      }

      mockRepo.findOneBy.mockResolvedValue(doc);

      const result = await service.getStatus('e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb');

      expect(result).toEqual(response);
      expect(result.data.status).toBe(IngestionStatus.COMPLETED);
      expect(result.statusCode).toBe(200);
    });
  });

  describe('mock ingestion manager', () => {
    it('should eventually mark ingestion as COMPLETED or FAILED', async () => {

      const doc = {
        "id": "e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb",
        "created_at": "2025-06-15T12:51:48.260Z",
        "updated_at": "2025-06-15T13:29:42.414Z",
        "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "originalName": "Notification Service doc -Pi42.pdf",
        "mimetype": "application/pdf",
        "size": 64790,
        "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "description": "random doc",
        "ingestionStatus": "processing",
        "ingestionStartedAt": "2025-06-15T12:51:48.260Z",
        "ingestionCompletedAt": null,
        "ingestionRetryCount": 0,
      }
      jest.spyOn(global.Math, 'random').mockReturnValue(0.6); // force success

      await service.simulateIngestion(doc as unknown as Document);

      jest.advanceTimersByTime(6000); // simulate 6s delay

      // Wait for the queued promise inside setTimeout to resolve
      await Promise.resolve();

      expect(doc.ingestionStatus).toBe(IngestionStatus.COMPLETED);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

});

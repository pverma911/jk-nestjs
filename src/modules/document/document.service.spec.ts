jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    createReadStream: jest.fn(() => require('stream').Readable.from(['mocked content'])),
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';
import { User } from '../../entities/user.entity';
import { promises as fsPromise } from 'fs';
import { StreamableFile } from '@nestjs/common';
import { UpdateDocumentDto } from './dto/updateDocument.dto';
import * as path from 'path';


describe('DocumentService', () => {
  let service: DocumentService;
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findAllByUserId: jest.fn(),
    delete: jest.fn(),
  };

  const mockMulterFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'document.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 204800,
    destination: './uploads',
    filename: '1721132139243-f873d3f0-02a6-4e2b-bc18-7f22ffb7fd45.pdf',
    path: 'uploads/1721132139243-f873d3f0-02a6-4e2b-bc18-7f22ffb7fd45.pdf',
    buffer: Buffer.from(''),
    stream: null as any
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: DocumentRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should upload a document', async () => {
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'document.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 204800,
      destination: './uploads',
      filename: '1721132139243-f873d3f0-02a6-4e2b-bc18-7f22ffb7fd45.pdf',
      path: 'uploads/1721132139243-f873d3f0-02a6-4e2b-bc18-7f22ffb7fd45.pdf',
      buffer: Buffer.from(''),
      stream: null as any
    };

    const user = { id: 'e7b4fbd6-3c0e-4a2c-8c17-cc42f889e2cf' } as User;

    const save = {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedBy: user,
    }
    const docEntity = {
      "id": "6397a287-7a48-4549-9a44-4d873271c381",
      "created_at": "2025-06-15T12:51:48.260Z",
      "updated_at": "2025-06-15T13:29:42.414Z",
      "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
      "originalName": "Notification Service doc.pdf",
      "mimetype": "application/pdf",
      "size": 64790,
      "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
      "description": null,
      "ingestionStatus": "pending",
      "ingestionStartedAt": null,
      "ingestionCompletedAt": null,
      "ingestionRetryCount": 0
    }
    mockRepo.create.mockReturnValue(save);
    mockRepo.save.mockResolvedValue(docEntity);

    const response = {
      "statusCode": 201,
      "success": true,
      "message": "Document uploaded",
      "data": {
        "docId": "6397a287-7a48-4549-9a44-4d873271c381"
      }
    }

    const result = await service.upload(file, user);
    expect(result).toEqual(response)
    expect(result.data.docId).toBe(docEntity.id);
  });

  it('should return user documents', async () => {
    const response = {
      "statusCode": 200,
      "success": true,
      "message": "Documents recieved",
      "data": {
        "documents": [
          {
            "id": "6397a287-7a48-4549-9a44-4d873271c381",
            "created_at": "2025-06-15T12:51:48.260Z",
            "updated_at": "2025-06-15T13:29:42.414Z",
            "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
            "originalName": "Notification Service doc.pdf",
            "mimetype": "application/pdf",
            "size": 64790,
            "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
            "description": null,
            "ingestionStatus": "completed",
            "ingestionStartedAt": "2025-06-15T18:59:38.394Z",
            "ingestionCompletedAt": "2025-06-15T18:59:42.412Z",
            "ingestionRetryCount": 0
          },
          {
            "id": "3c8269bc-a366-4aab-85a1-9ca260093130",
            "created_at": "2025-06-15T13:32:14.048Z",
            "updated_at": "2025-06-15T13:32:14.048Z",
            "filename": "1750014134036-d92e6f75-fab5-4711-a4b5-c5352c6f4863.PDF",
            "originalName": "5Night_Kashmir.PDF",
            "mimetype": "application/pdf",
            "size": 591495,
            "path": "uploads\\1750014134036-d92e6f75-fab5-4711-a4b5-c5352c6f4863.PDF",
            "description": null,
            "ingestionStatus": "pending",
            "ingestionStartedAt": null,
            "ingestionCompletedAt": null,
            "ingestionRetryCount": 0
          }
        ]
      }
    }
    const docs = [
      {
        "id": "6397a287-7a48-4549-9a44-4d873271c381",
        "created_at": "2025-06-15T12:51:48.260Z",
        "updated_at": "2025-06-15T13:29:42.414Z",
        "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "originalName": "Notification Service doc.pdf",
        "mimetype": "application/pdf",
        "size": 64790,
        "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
        "description": null,
        "ingestionStatus": "completed",
        "ingestionStartedAt": "2025-06-15T18:59:38.394Z",
        "ingestionCompletedAt": "2025-06-15T18:59:42.412Z",
        "ingestionRetryCount": 0
      },
      {
        "id": "3c8269bc-a366-4aab-85a1-9ca260093130",
        "created_at": "2025-06-15T13:32:14.048Z",
        "updated_at": "2025-06-15T13:32:14.048Z",
        "filename": "1750014134036-d92e6f75-fab5-4711-a4b5-c5352c6f4863.PDF",
        "originalName": "5Night_Kashmir.PDF",
        "mimetype": "application/pdf",
        "size": 591495,
        "path": "uploads\\1750014134036-d92e6f75-fab5-4711-a4b5-c5352c6f4863.PDF",
        "description": null,
        "ingestionStatus": "pending",
        "ingestionStartedAt": null,
        "ingestionCompletedAt": null,
        "ingestionRetryCount": 0
      }
    ]
    mockRepo.findAllByUserId.mockResolvedValue(docs);

    const result = await service.findMyDocuments('e7b4fbd6-3c0e-4a2c-8c17-cc42f889e2cf');

    expect(mockRepo.findAllByUserId).toHaveBeenCalledWith('e7b4fbd6-3c0e-4a2c-8c17-cc42f889e2cf');
    expect(result).toEqual(response)
    expect(result.data.documents).toBe(docs);
    expect(result.statusCode).toBe(200);

  });

  it('should delete document and file if exists', async () => {
    const doc = {
      "id": "6397a287-7a48-4549-9a44-4d873271c381",
      "created_at": "2025-06-15T12:51:48.260Z",
      "updated_at": "2025-06-15T13:29:42.414Z",
      "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
      "originalName": "Notification Service doc.pdf",
      "mimetype": "application/pdf",
      "size": 64790,
      "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
      "description": null,
      "ingestionStatus": "pending",
      "ingestionStartedAt": null,
      "ingestionCompletedAt": null,
      "ingestionRetryCount": 0
    }
    mockRepo.findById.mockResolvedValue(doc);
    jest.spyOn(fsPromise, 'access').mockResolvedValueOnce(undefined);
    jest.spyOn(fsPromise, 'unlink').mockResolvedValueOnce(undefined);
    mockRepo.delete.mockResolvedValue({
      raw: null,
      affected: 1
    });

    const response = {
      "statusCode": 200,
      "success": true,
      "message": "Document deleted",
      "data": {}
    }

    const result = await service.delete('6397a287-7a48-4549-9a44-4d873271c381');
    expect(result).toEqual(response);
    expect(result.statusCode).toBe(200);
  });

  it('should fetch document stream', async () => {
    const doc = {
      "id": "6397a287-7a48-4549-9a44-4d873271c381",
      "created_at": "2025-06-15T12:51:48.260Z",
      "updated_at": "2025-06-15T13:29:42.414Z",
      "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
      "originalName": "Notification Service doc.pdf",
      "mimetype": "application/pdf",
      "size": 64790,
      "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
      "description": null,
      "ingestionStatus": "pending",
      "ingestionStartedAt": null,
      "ingestionCompletedAt": null,
      "ingestionRetryCount": 0
    }
    const res = { set: jest.fn() } as any;
    mockRepo.findById.mockResolvedValue(doc);
    jest.spyOn(fsPromise, 'access').mockResolvedValue(undefined);

    const result = await service.fetchFile('6397a287-7a48-4549-9a44-4d873271c381', res as any);
    expect(res.set).toHaveBeenCalled();
    expect(result).toBeInstanceOf(StreamableFile);
  });

  it('should update document metadata and filename', async () => {
    const doc = {
      "id": "6397a287-7a48-4549-9a44-4d873271c381",
      "created_at": "2025-06-15T12:51:48.260Z",
      "updated_at": "2025-06-15T13:29:42.414Z",
      "filename": "1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
      "originalName": "Notification Service doc.pdf",
      "mimetype": "application/pdf",
      "size": 64790,
      "path": "uploads\\1750011708255-f413cabc-e670-45b0-8e16-3285a752fca8.pdf",
      "description": "some desc",
      "ingestionStatus": "pending",
      "ingestionStartedAt": null,
      "ingestionCompletedAt": null,
      "ingestionRetryCount": 0
    }
    const dto: UpdateDocumentDto = { newName: 'renamed', description: "Description" };

    mockRepo.findById.mockResolvedValue(doc);

    if (dto.newName) {
      const oldPath = path.join(process.cwd(), doc.path);
      const newFilename = dto.newName;
      const newPathRel = path.join('uploads', newFilename);
      const newPath = path.join(process.cwd(), newPathRel);
      doc.filename = newFilename;
      doc.path = newPathRel;

      jest.spyOn(fsPromise, 'rename').mockResolvedValueOnce(undefined);
    }

    if (dto.description) {
      doc.description = dto.description
    }

    mockRepo.save.mockResolvedValue(doc);

    const response = {
      "statusCode": 200,
      "success": true,
      "message": "Document updated",
      "data": {}
    }

    const result = await service.update("6397a287-7a48-4549-9a44-4d873271c381", dto);

    expect(result).toEqual(response);
    expect(result.statusCode).toBe(200);

  });
});

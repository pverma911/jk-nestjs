import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { User } from '../../entities/user.entity';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  const mockService = {
    upload: jest.fn(),
    findMyDocuments: jest.fn(),
    delete: jest.fn(),
    fetchFile: jest.fn(),
    update: jest.fn(),
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
      controllers: [DocumentController],
      providers: [
        { provide: DocumentService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { role: 'editor', id: 'e7b4fbd6-3c0e-4a2c-8c17-cc42f889e2cf' };
          return true;
        },
      })
      .compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should upload file', async () => {
    const file = mockMulterFile
    const user = { role: 'editor', id: 'e7b4fbd6-3c0e-4a2c-8c17-cc42f889e2cf' } as User
    const response = {
      "statusCode": 201,
      "success": true,
      "message": "Document uploaded",
      "data": {
        "docId": "3c8269bc-a366-4aab-85a1-9ca260093130"
      }
    }
    mockService.upload.mockResolvedValue(response);

    const result = await controller.upload(file, user);
    expect(result).toBe(response);
    expect(mockService.upload).toHaveBeenCalledWith(file, user);
  });

  it("should return user's documents", async () => {
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

    const userId = 'e7b4fbd6-3c0e-4a2c-8c17-cc42f889e2cf'

    mockService.findMyDocuments.mockResolvedValue(response);

    const result = await controller.findMyDocuments(userId);
    expect(result).toBe(response);
    expect(mockService.findMyDocuments).toHaveBeenCalledWith(userId);
  });

  it('should delete document', async () => {
    const response = {
      "statusCode": 200,
      "success": true,
      "message": "Document deleted",
      "data": {}
    }
    mockService.delete.mockResolvedValue(response);

    const result = await controller.delete('3c8269bc-a366-4aab-85a1-9ca260093130');
    expect(result).toBe(response);
    expect(mockService.delete).toHaveBeenCalledWith('3c8269bc-a366-4aab-85a1-9ca260093130');
  });

  it('should fetch file', async () => {
    const mockRes = {} as any;
    const response = { stream: true };
    mockService.fetchFile.mockResolvedValue(response);

    const result = await controller.fetchFile('3c8269bc-a366-4aab-85a1-9ca260093130', mockRes);
    expect(result).toBe(response);
    expect(mockService.fetchFile).toHaveBeenCalledWith('3c8269bc-a366-4aab-85a1-9ca260093130', mockRes);
  });

  it('should update document', async () => {
    const dto = { newName: 'newName' };
    const response = {
      "statusCode": 200,
      "success": true,
      "message": "Document updated",
      "data": {}
    }
    mockService.update.mockResolvedValue(response);

    const result = await controller.update('3c8269bc-a366-4aab-85a1-9ca260093130', dto);
    expect(result).toBe(response);
    expect(mockService.update).toHaveBeenCalledWith('3c8269bc-a366-4aab-85a1-9ca260093130', dto);
  });
});

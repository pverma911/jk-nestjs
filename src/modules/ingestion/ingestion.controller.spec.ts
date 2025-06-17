import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockService = {
    triggerIngestion: jest.fn(),
    getStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({
      canActivate: (context) => {
        const req = context.switchToHttp().getRequest();
        req.user = { role: 'admin' };
        return true;
      },
    })
      .compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should trigger ingestion', async () => {
    const result = {
      "statusCode": 200,
      "success": true,
      "message": "Ingestion Started",
      "data": {
        "status": "processing"
      }
    }
    mockService.triggerIngestion.mockResolvedValue(result);

    expect(await controller.trigger('e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb')).toEqual(result);
    expect(mockService.triggerIngestion).toHaveBeenCalledWith('e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb');
  });

  it('should return ingestion status', async () => {
    const result = {
      "statusCode": 200,
      "success": true,
      "message": "Ingestion Status",
      "data": {
        "docId": "e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb",
        "status": "completed",
        "startedAt": "2025-06-15T18:59:38.394Z",
        "completedAt": "2025-06-15T18:59:42.412Z"
      }
    }
    mockService.getStatus.mockResolvedValue(result);

    expect(await controller.getStatus('e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb')).toEqual(result);
    expect(mockService.getStatus).toHaveBeenCalledWith('e3b6c6d1-1f8e-4f32-8b3b-2a6b733fd5cb');
  });
});

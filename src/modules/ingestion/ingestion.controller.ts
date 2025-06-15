import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('ingestion')
export class IngestionController {
  constructor (private readonly ingestionService: IngestionService) { }

  @Post(':docId/trigger')
  async trigger(@Param('docId') docId: string) {
    return await this.ingestionService.triggerIngestion(docId);
  }

  @Get(':docId/status')
  async getStatus(@Param('docId') docId: string) {
    return await this.ingestionService.getStatus(docId);
  }
}

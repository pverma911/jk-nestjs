import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '../user/user.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ingestion')
export class IngestionController {
  constructor (private readonly ingestionService: IngestionService) { }

  @Roles(UserRole.ADMIN)
  @Post(':docId/trigger')
  async trigger(@Param('docId') docId: string) {
    return await this.ingestionService.triggerIngestion(docId);
  }

  @Roles(UserRole.ADMIN)
  @Get(':docId/status')
  async getStatus(@Param('docId') docId: string) {
    return await this.ingestionService.getStatus(docId);
  }
}

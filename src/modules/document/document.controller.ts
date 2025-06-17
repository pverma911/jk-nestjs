import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, UseGuards, Delete, Res, Patch, Body } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as crypto from "crypto"
import { CurrentUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { Response } from 'express';
import { UpdateDocumentDto } from './dto/updateDocument.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/role.decorator';
import { UserRole } from '../user/user.enum';

/**
 * Document Controller
 */
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  constructor (private readonly documentService: DocumentService) { }

  @Roles(UserRole.EDITOR)
  @Post("/upload")
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${crypto.randomUUID()}`;;
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
    return this.documentService.upload(file, user);
  }

  @Roles(UserRole.VIEWER)
  @Get("/my")
  findMyDocuments(@CurrentUser("id") userId: string) {
    return this.documentService.findMyDocuments(userId);
  }

  @Roles(UserRole.EDITOR)
  @Delete("/:id")
  delete(@Param("id") id: string) {
    return this.documentService.delete(id);
  }

  @Roles(UserRole.VIEWER)
  @Get("/:id")
  fetchFile(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    return this.documentService.fetchFile(id, res);
  }

  @Roles(UserRole.EDITOR)
  @Patch("/:id")
  update(@Param("id") id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentService.update(id, updateDocumentDto);
  }
}

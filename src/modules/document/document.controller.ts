import { Controller, Get, Post, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import crypto from "crypto"


@Controller('documents')
export class DocumentController {
  constructor (private readonly documentService: DocumentService) { }

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
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.documentService.upload();
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }
}

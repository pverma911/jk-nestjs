import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DocumentRepository } from './document.repository';
import { ResponseService } from 'src/utils/response.utils';
import * as path from 'path';
import { promises as fs } from 'fs';
import * as fsNative from 'fs';
import { Response } from 'express';
import { UpdateDocumentDto } from './dto/updateDocument.dto';

@Injectable()
export class DocumentService extends ResponseService {
  constructor (private readonly documentRepo: DocumentRepository) { super() }

  async upload(file: Express.Multer.File, user: User) {
    const doc = this.documentRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedBy: user,
    });

    await this.documentRepo.save(doc);

    return this.serviceResponse(HttpStatus.CREATED, {}, "Document uploaded")
  }

  async findAll() {
    const documents = await this.documentRepo.find();
    return this.serviceResponse(HttpStatus.OK, { documents }, "Documents recieved")
  }

  async findMyDocuments(userId: string) {
    const documents = await this.documentRepo.findAllByUserId(userId)
    return this.serviceResponse(HttpStatus.OK, { documents }, "Documents recieved")
  }

  async delete(id: string) {
    const doc = await this.documentRepo.findById(id);

    if (!doc) throw new NotFoundException('Document not found');

    const filePath = doc.path
    const finalPath = path.join(process.cwd(), filePath.replace(/\\/g, '/'));

    try {
      // Check if file exists
      await fs.access(finalPath);
      await fs.unlink(finalPath);
      console.log("File deleted")
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`File not found: at ${finalPath}`);
      } else {
        throw new InternalServerErrorException('Unable to delete document');
      }
    }

    await this.documentRepo.delete(id);
    return this.serviceResponse(HttpStatus.OK, {}, "Document deleted")
  }

  async fetchFile(id: string, res: Response) {
    const doc = await this.documentRepo.findById(id);

    if (!doc) throw new NotFoundException('Document not found');

    const filePath = doc.path
    const finalPath = path.join(process.cwd(), filePath.replace(/\\/g, '/'));

    try {
      // Check if file exists
      await fs.access(finalPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`File not found: at ${finalPath}`);
      } else {
        throw new InternalServerErrorException('Unable to fetch document');
      }
    }

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${doc.filename}"`,
    });

    return new StreamableFile(fsNative.createReadStream(filePath));
  }

  async update(id: string, payload: UpdateDocumentDto) {
    const doc = await this.documentRepo.findById(id);

    if (!doc) throw new NotFoundException('Document not found');

    if (payload.newName) {
      const { newName } = payload

      const oldPath = path.join(process.cwd(), doc.path.replace(/\\/g, '/'));
      const ext = path.extname(doc.filename);
      const newFilename = newName + ext;
      const newPathRel = path.join('uploads', newFilename);
      const newPath = path.join(process.cwd(), newPathRel);

      try {
        await fs.rename(oldPath, newPath);
      } catch (err) {
        throw new InternalServerErrorException('File rename failed: ' + err.message);
      }

      doc.filename = newFilename;
      doc.path = newPathRel;

    }

    if (payload.description)
      doc.description = payload.description

    await this.documentRepo.save(doc);

    return this.serviceResponse(HttpStatus.OK, {}, "Document updated")
  }
}

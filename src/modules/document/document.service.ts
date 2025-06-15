import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentService {
  upload() {
    return 'This action adds a new document';
  }

  findAll() {
    return `This action returns all document`;
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update() {
    return `This action updates a document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}

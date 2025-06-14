import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseService {
    private readonly errorStatusCodes = [400, 401, 403, 404, 409, 412, 422, 469, 500];

    private isSuccess(statusCode: number): boolean {
        return !this.errorStatusCodes.includes(statusCode);
    }

    serviceResponse(statusCode: number, data: any, message?: string) {
        return {
            success: this.isSuccess(statusCode),
            statusCode,
            message,
            data,
        };
    }
}

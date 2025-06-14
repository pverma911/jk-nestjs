import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
    private readonly errorStatusCodes = [400, 401, 403, 404, 409, 412, 422, 469, 500];

    private isSuccess(statusCode: number): boolean {
        return !this.errorStatusCodes.includes(statusCode);
    }

    serviceResponse(statusCode: number, data: any, message?: string) {
        return {
            statusCode,
            success: this.isSuccess(statusCode),
            message,
            data,
        };
    }
}

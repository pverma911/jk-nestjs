import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, ConflictException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as any

        response.status(status).json({
            statusCode: status,
            success: false,
            message: status === HttpStatus.BAD_REQUEST ? exceptionResponse.message[0] : exceptionResponse.message,
            data: {}
        });
    }
}
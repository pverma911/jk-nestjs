import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, ConflictException, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR

        // If exception has getStatus, use it
        if (
            exception instanceof HttpException ||
            (typeof exception.getStatus === 'function')
        ) {
            status = exception.getStatus();
        }
        const exceptionResponse = exception.getResponse() as any

        response.status(status).json({
            statusCode: status,
            success: false,
            message: status === HttpStatus.BAD_REQUEST ? exceptionResponse.message[0] : exceptionResponse.message,
            data: {}
        });
    }
}
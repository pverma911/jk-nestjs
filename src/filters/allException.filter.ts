import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, ConflictException, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let exceptionResponse = {} as any
        let message = "Something Went Wrong!"

        // If exception has getStatus, use it
        if (
            exception instanceof HttpException ||
            (typeof exception.getStatus === 'function')
        ) {
            status = exception.getStatus();
        }
        if (
            exception instanceof HttpException ||
            (typeof exception.getResponse === 'function')
        ) {
            exceptionResponse = exception.getResponse() as any
        }

        if (status === HttpStatus.BAD_REQUEST) {
            message = exceptionResponse.message[0]
        } else {
            message = exceptionResponse.message ?? message
        }

        console.error('Caught Exception:', exception);
        response.status(status).json({
            statusCode: status,
            success: false,
            message,
            data: {}
        });
    }
}
export interface IServiceResponse {
    success: boolean
    statusCode: number;
    data: Record<string,any>;
    message: string;
}
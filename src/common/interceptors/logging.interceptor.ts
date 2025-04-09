import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, params, query } = request;
        const userAgent = request.get('user-agent') ?? '';
        const ip = request.ip ?? '';

        const now = Date.now();
        const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

        this.logger.log(`[${requestId}] Request: ${method} ${url} - Body: ${JSON.stringify(body)} - Params: ${JSON.stringify(params)} - Query: ${JSON.stringify(query)} - IP: ${ip} - UserAgent: ${userAgent}`);

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const responseTime = Date.now() - now;
                    this.logger.log(`[${requestId}] Response: ${method} ${url} - ${responseTime}ms - Data: ${JSON.stringify(data).substring(0, 1000)}${JSON.stringify(data).length > 1000 ? '...' : ''}`);
                },
                error: (error) => {
                    const responseTime = Date.now() - now;
                    this.logger.error(`[${requestId}] Error: ${method} ${url} - ${responseTime}ms - ${error.message}`, error.stack);
                },
            }),
        );
    }
}
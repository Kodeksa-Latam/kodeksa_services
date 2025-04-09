import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { AxiosError } from 'axios';

/**
 * Cliente para servicios externos
 * 
 * Implementa la comunicación con servicios externos vía HTTP.
 */
@Injectable()
export class ExternalServiceClient {
  private readonly logger = new Logger(ExternalServiceClient.name);
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // En una aplicación real, estas configuraciones vendrían del configService
    this.baseUrl = 'https://api.example.com';
    this.timeoutMs = configService.get('app.apiTimeout') ?? 5000;
  }

  /**
   * Notifica a un servicio externo que se ha creado un usuario
   */
  async notifyUserCreation(userId: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/notifications/user-created`,
          { userId },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': 'api-key-here', // En producción, usaríamos configService
            },
          },
        ).pipe(
          timeout(this.timeoutMs),
          catchError((error: AxiosError) => {
            this.logger.error(
              `Error al notificar creación de usuario [${userId}]: ${error.message}`,
              error.stack,
            );
            throw error;
          }),
        ),
      );

      this.logger.log(`Notificación de creación de usuario [${userId}] enviada correctamente`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error al notificar creación de usuario [${userId}]: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Verifica información del usuario con un servicio externo
   */
  async verifyUserInfo(email: string): Promise<{ isValid: boolean; score: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/verify-user`,
          {
            params: { email },
            headers: {
              'X-API-Key': 'api-key-here', // En producción, usaríamos configService
            },
          },
        ).pipe(
          timeout(this.timeoutMs),
          catchError((error: AxiosError) => {
            this.logger.error(
              `Error al verificar usuario [${email}]: ${error.message}`,
              error.stack,
            );
            throw error;
          }),
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error al verificar usuario [${email}]: ${error.message}`,
        error.stack,
      );
      // En caso de error, devolvemos valores por defecto
      return { isValid: true, score: 50 };
    }
  }
}
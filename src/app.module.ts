import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { UserModule } from './modules/users/user.module';
import { CardConfigurationModule } from './modules/card-configurations/card-configuration.module';
import { SolutionModule } from './modules/solutions/solution.module';
import { CurriculumModule } from './modules/curriculums/curriculum.module';

@Module({
  imports: [
    // Carga de configuraciones
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),

    // Configuración de base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseConfig = await configService.get('database');
        return {
          ...databaseConfig,
        };
      },
    }),

    // Módulos de la aplicación
    UserModule,
    CardConfigurationModule,
    SolutionModule,
    CurriculumModule
  ],
  providers: [
    // Interceptor global para logging
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
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
import { SkillModule } from './modules/skills/skill.module';
import { WorkExperienceModule } from './modules/work-experiences/work-experience.module';
import { VacancyModule } from './modules/vacancies/vacancy.module';
import { ApplicationModule } from './modules/applications/application.module';
import { CloudinaryModule } from './common/services/cloudinary.module';

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
    CurriculumModule,
    SkillModule,
    WorkExperienceModule,
    VacancyModule,
    ApplicationModule,
    CloudinaryModule
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
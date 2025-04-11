import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './application.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { VacancyModule } from '../vacancies/vacancy.module';
import { CloudinaryModule } from 'src/common/services/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity]),
    forwardRef(() => VacancyModule), // Prevenir dependencia circular
    CloudinaryModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './application.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { VacancyModule } from '../vacancies/vacancy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity]),
    forwardRef(() => VacancyModule), // Prevenir dependencia circular
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
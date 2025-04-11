import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacancyEntity } from './vacancy.entity';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { ApplicationModule } from '../applications/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VacancyEntity]),
    forwardRef(() => ApplicationModule), // Prevenir dependencia circular
  ],
  controllers: [VacancyController],
  providers: [VacancyService],
  exports: [VacancyService],
})
export class VacancyModule {}
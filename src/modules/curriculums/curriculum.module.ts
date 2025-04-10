import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumEntity } from './curriculum.entity';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurriculumEntity]),
    forwardRef(() => UserModule), // Prevenir dependencia circular
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService],
  exports: [CurriculumService],
})
export class CurriculumModule {}
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CardConfigurationModule } from '../card-configurations/card-configuration.module';
import { CurriculumModule } from '../curriculums/curriculum.module';
import { SkillModule } from '../skills/skill.module';
import { WorkExperienceModule } from '../work-experiences/work-experience.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => CardConfigurationModule), // Prevenir dependencia circular
    forwardRef(() => CurriculumModule), // Prevenir dependencia circular
    forwardRef(() => SkillModule), // Prevenir dependencia circular
    forwardRef(() => WorkExperienceModule), // Prevenir dependencia circular
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
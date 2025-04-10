import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolutionController } from './solution.controller';
import { SolutionService } from './solution.service';
import { SolutionEntity } from './solution.entity';
import { FeatureEntity } from './feature.entity';

/**
 * Módulo de Soluciones
 * 
 * Gestiona las soluciones y sus características.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([SolutionEntity, FeatureEntity]),
  ],
  controllers: [SolutionController],
  providers: [SolutionService],
  exports: [SolutionService],
})
export class SolutionModule {}
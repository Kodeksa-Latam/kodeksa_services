import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SolutionEntity } from './solution.entity';

/**
 * Entidad de Característica de Solución para TypeORM
 * 
 * Define el esquema de la tabla de características de soluciones en la base de datos.
 */
@Entity('features')
export class FeatureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_solution' })
  solutionId: string;

  @Column({ name: 'feature_description' })
  featureDescription: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => SolutionEntity, solution => solution.features)
  @JoinColumn({ name: 'id_solution' })
  solution: SolutionEntity;
}
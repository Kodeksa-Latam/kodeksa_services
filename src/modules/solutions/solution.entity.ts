import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FeatureEntity } from './feature.entity';

/**
 * Entidad de Solución para TypeORM
 * 
 * Define el esquema de la tabla de soluciones en la base de datos.
 */
@Entity('solutions')
export class SolutionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  icon: string;

  @Column()
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => FeatureEntity, feature => feature.solution)
  features: FeatureEntity[];
}
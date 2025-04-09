import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { CardConfigurationEntity } from '../card-configurations/card-configuration.entity';

/**
 * Entidad de Usuario para TypeORM
 * 
 * Define el esquema de la tabla de usuarios en la base de datos.
 */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100, unique: true })
  @Index()
  email: string;

  // @Column()
  // password: string;

  @Column({ length: 50, nullable: true })
  role: string;

  @Column({ length: 100, unique: true })
  @Index()
  slug: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  showCurriculum: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => CardConfigurationEntity, cardConfig => cardConfig.user)
  cardConfiguration: CardConfigurationEntity;
}
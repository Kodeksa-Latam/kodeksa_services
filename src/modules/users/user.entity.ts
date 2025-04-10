import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { CardConfigurationEntity } from '../card-configurations/card-configuration.entity';
import { CurriculumEntity } from '../curriculums/curriculum.entity';
import { SkillEntity } from '../skills/skill.entity';
import { WorkExperienceEntity } from '../work-experiences/work-experience.entity';

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

  @OneToOne(() => CurriculumEntity, curriculum => curriculum.user)
  curriculum: CurriculumEntity;

  @OneToMany(() => SkillEntity, skill => skill.user)
  skills: SkillEntity[];

  @OneToMany(() => WorkExperienceEntity, workExperience => workExperience.user)
  workExperiences: WorkExperienceEntity[];
}
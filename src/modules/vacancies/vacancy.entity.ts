import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
  } from 'typeorm';
  import { ApplicationEntity } from '../applications/application.entity';
  
  /**
   * Entidad de Vacante para TypeORM
   * 
   * Define el esquema de la tabla de vacantes en la base de datos.
   */
  @Entity('vacancies')
  export class VacancyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'job_title' })
    jobTitle: string;
  
    @Column({ unique: true })
    @Index()
    slug: string;
  
    @Column()
    mode: string;
  
    @Column({ name: 'years_experience', default: 0 })
    yearsExperience: number;
  
    @Column({ name: 'short_description' })
    shortDescription: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @Column({ name: 'stack_required', type: 'simple-array', default: '' })
    stackRequired: string[];
  
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
  
    @Column({ default: 'open' })
    status: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relaciones
    @OneToMany(() => ApplicationEntity, application => application.vacancy)
    applications: ApplicationEntity[];
  }
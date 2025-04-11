import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { VacancyEntity } from '../vacancies/vacancy.entity';
  
  /**
   * Entidad de Aplicación para TypeORM
   * 
   * Define el esquema de la tabla de aplicaciones a vacantes en la base de datos.
   */
  @Entity('applications')
  export class ApplicationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'id_vacancy' })
    vacancyId: string;
  
    @Column()
    name: string;
  
    @Column()
    email: string;
  
    @Column()
    phone: string;
  
    @Column({ default: 'pending' })
    status: string;
  
    @Column({ name: 'application_motivation', type: 'text', nullable: true })
    applicationMotivation: string;
  
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
  
    @Column({ name: 'cv_url', nullable: true })
    cvUrl: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relaciones
    @ManyToOne(() => VacancyEntity, vacancy => vacancy.applications)
    @JoinColumn({ name: 'id_vacancy' })
    vacancy: VacancyEntity;
  }
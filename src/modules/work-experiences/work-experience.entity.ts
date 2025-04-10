import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { UserEntity } from '../users/user.entity';
  
  /**
   * Entidad de Experiencia Laboral para TypeORM
   * 
   * Define el esquema de la tabla de experiencias laborales en la base de datos.
   */
  @Entity('work_experiences')
  export class WorkExperienceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'id_user' })
    userId: string;
  
    @Column()
    role: string;
  
    @Column({ name: 'company_name' })
    companyName: string;
  
    @Column({ name: 'from_year', type: 'timestamp' })
    fromYear: Date;
  
    @Column({ name: 'until_year', type: 'timestamp', nullable: true })
    untilYear: Date;
  
    @Column({ name: 'role_description', type: 'text', nullable: true })
    roleDescription: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relaciones
    @ManyToOne(() => UserEntity, user => user.workExperiences)
    @JoinColumn({ name: 'id_user' })
    user: UserEntity;
  }
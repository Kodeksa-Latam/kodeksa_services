import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { UserEntity } from '../users/user.entity';
  
  /**
   * Entidad de Currículum para TypeORM
   * 
   * Define el esquema de la tabla de currículums en la base de datos.
   */
  @Entity('curriculums')
  export class CurriculumEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'id_user' })
    userId: string;
  
    @Column({ name: 'about_me', type: 'text', nullable: true })
    aboutMe: string;
  
    @Column({ name: 'github_slug', nullable: true })
    githubSlug: string;
  
    @Column({ name: 'linkedin_slug', nullable: true })
    linkedinSlug: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relaciones
    @OneToOne(() => UserEntity, user => user.curriculum)
    @JoinColumn({ name: 'id_user' })
    user: UserEntity;
  }
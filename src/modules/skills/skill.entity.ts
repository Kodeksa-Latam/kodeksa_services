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
   * Entidad de Skill para TypeORM
   * 
   * Define el esquema de la tabla de habilidades en la base de datos.
   */
  @Entity('skills')
  export class SkillEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'id_user' })
    userId: string;
  
    @Column({ name: 'skill_name' })
    skillName: string;
  
    @Column({ name: 'url_certificate', nullable: true })
    urlCertificate: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relaciones
    @ManyToOne(() => UserEntity, user => user.skills)
    @JoinColumn({ name: 'id_user' })
    user: UserEntity;
  }
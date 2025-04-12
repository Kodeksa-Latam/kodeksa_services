import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { UserEntity } from '../users/user.entity';
  import { BlogSectionEntity } from './blog-section.entity';
  
  /**
   * Entidad de Blog para TypeORM
   * 
   * Define el esquema de la tabla de blogs en la base de datos.
   */
  @Entity('blogs')
  export class BlogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'id_user' })
    userId: string;
  
    @Column({ nullable: true })
    image: string;
  
    @Column()
    title: string;
  
    @Column({ unique: true })
    @Index()
    slug: string;
  
    @Column({ name: 'short_description', type: 'text' })
    shortDescription: string;
  
    @Column('simple-array', { default: '' })
    categories: string[];
  
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relaciones
    @ManyToOne(() => UserEntity, user => user.blogs)
    @JoinColumn({ name: 'id_user' })
    user: UserEntity;
  
    @OneToMany(() => BlogSectionEntity, section => section.blog, {
      cascade: true
    })
    sections: BlogSectionEntity[];
  }
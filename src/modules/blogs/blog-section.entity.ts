import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { BlogEntity } from './blog.entity';
  
  /**
   * Tipos de sección de blog
   */
  export enum BlogSectionType {
    PARAGRAPH = 'paragraph',
    IMAGE = 'image',
    HEADING = 'heading',
    SUBHEADING = 'subheading',
    LIST = 'list',
  }
  
  /**
   * Tipos de estilo para listas
   */
  export enum BlogSectionListStyle {
    ORDERED = 'ordered',
    UNORDERED = 'unordered',
  }
  
  /**
   * Entidad de Sección de Blog para TypeORM
   * 
   * Define el esquema de la tabla de secciones de blog en la base de datos.
   */
  @Entity('blog_sections')
  export class BlogSectionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'id_blog' })
    blogId: string;
  
    @Column({ type: 'int' })
    order: number;
  
    @Column({
      type: 'enum',
      enum: BlogSectionType,
      default: BlogSectionType.PARAGRAPH,
    })
    type: BlogSectionType;
  
    @Column({ type: 'text', nullable: true })
    content: string;
  
    @Column({ nullable: true })
    src: string;
  
    @Column({ nullable: true })
    alt: string;
  
    @Column({ nullable: true })
    caption: string;
  
    @Column({
      type: 'enum',
      enum: BlogSectionListStyle,
      nullable: true,
    })
    style: BlogSectionListStyle;
  
    @Column('simple-array', { nullable: true })
    items: string[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relaciones
    @ManyToOne(() => BlogEntity, blog => blog.sections, {
      onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'id_blog' })
    blog: BlogEntity;
  }
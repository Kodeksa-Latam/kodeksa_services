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
 * Entidad de Configuración de Tarjeta para TypeORM
 * 
 * Define el esquema de la tabla de configuraciones de tarjeta en la base de datos.
 */
@Entity('card_configurations')
export class CardConfigurationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_user' })
  userId: string;

  @Column({ nullable: true })
  imageSize: number;

  @Column({ nullable: true })
  imageLeftOffset: string;

  @Column({ nullable: true })
  bgColor: string;

  @Column({ nullable: true })
  textAbove: string;

  @Column({ nullable: true })
  textAboveColor: string;

  @Column({ nullable: true })
  aboveFontFamily: string;

  @Column({ nullable: true })
  aboveFontSize: string;

  @Column({ nullable: true })
  aboveFontWeight: string;

  @Column({ nullable: true })
  aboveLetterSpacing: string;

  @Column({ nullable: true })
  aboveTextTransform: string;

  @Column({ nullable: true })
  aboveTextTopOffset: string;

  @Column({ nullable: true })
  textBelow: string;

  @Column({ nullable: true })
  belowFontWeight: string;

  @Column({ nullable: true })
  belowLetterSpacing: string;

  @Column({ nullable: true })
  belowFontFamily: string;

  @Column({ nullable: true })
  belowFontSize: string;

  @Column({ nullable: true })
  belowTextTransform: string;

  @Column({ nullable: true })
  textBelowColor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => UserEntity, user => user.cardConfiguration)
  @JoinColumn({ name: 'id_user' })
  user: UserEntity;
}
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogEntity } from './blog.entity';
import { BlogSectionEntity } from './blog-section.entity';
import { UserModule } from '../users/user.module';

/**
 * Módulo de Blogs
 * 
 * Gestiona blogs y sus secciones.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity, BlogSectionEntity]),
    forwardRef(() => UserModule), // Prevenir dependencia circular
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
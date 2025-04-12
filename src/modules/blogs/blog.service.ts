import { Injectable, HttpException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { BlogSectionEntity, BlogSectionType } from './blog-section.entity';
import { CreateBlogDto, UpdateBlogDto, BlogResponseDto } from './dto/blog.dto';
import { CreateBlogSectionDto, UpdateBlogSectionDto, BlogSectionResponseDto } from './dto/blog-section.dto';
import { UserService } from '../users/user.service';
import { BlogErrors } from './errors/blog-errors';
import { PaginatedResult } from '../../common/dto/pagination.dto';

/**
 * Servicio de Blogs
 * 
 * Implementa la lógica de negocio relacionada con los blogs y sus secciones.
 */
@Injectable()
export class BlogService {
    private readonly logger = new Logger(BlogService.name);

    constructor(
        @InjectRepository(BlogEntity)
        private readonly blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogSectionEntity)
        private readonly blogSectionRepository: Repository<BlogSectionEntity>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) { }

    /**
   * Obtiene todos los blogs con paginación y filtros
   */
  async findAll(options: {
    page: number;
    limit: number;
    isActive?: boolean;
    userId?: string;
    category?: string;
    search?: string;
    includeSections?: boolean;
  }): Promise<PaginatedResult<BlogResponseDto>> {
    try {
      const { page = 1, limit = 10, isActive, userId, category, search, includeSections = false } = options;
      const skip = (page - 1) * limit;
      
      // Construir las condiciones de búsqueda
      const where: FindOptionsWhere<BlogEntity> = {};
      
      if (isActive !== undefined) {
        where.isActive = isActive;
      }
      
      if (userId) {
        where.userId = userId;
      }
      
      // Las relaciones a cargar
      const relations = includeSections ? ['sections'] : [];
      relations.push('user');
      // Búsqueda por categoría o términos
      if (category || search) {
        const queryBuilder = this.blogRepository.createQueryBuilder('blog');
        
        // Aplicar condiciones where
        if (isActive !== undefined) {
          queryBuilder.andWhere('blog.isActive = :isActive', { isActive });
        }
        
        if (userId) {
          queryBuilder.andWhere('blog.userId = :userId', { userId });
        }
        
        // Buscar por categoría
        if (category) {
          queryBuilder.andWhere('blog.categories LIKE :category', { category: `%${category}%` });
        }
        
        // Buscar en varios campos
        if (search) {
          queryBuilder.andWhere(
            '(blog.title ILIKE :search OR blog.shortDescription ILIKE :search)',
            { search: `%${search}%` }
          );
        }
        
        // Incluir secciones si se solicita
        if (includeSections) {
          queryBuilder.leftJoinAndSelect('blog.sections', 'section')
                      .orderBy('section.order', 'ASC');
        }
        
        // Paginación
        queryBuilder.skip(skip).take(limit);
        
        // Ordenamiento
        queryBuilder.orderBy('blog.createdAt', 'DESC');
        
        // Ejecutar consulta
        const [blogs, totalItems] = await queryBuilder.getManyAndCount();
        
                        const items = blogs.map(blog => {
                    const responseDto = new BlogResponseDto(blog);
                    // Agregar información del autor
                    responseDto.author = {
                        name: blog.user ? `${blog.user.firstName} ${blog.user.lastName}` : 'Usuario Desconocido',
                        avatar: blog.user?.image || '/images/default-avatar.png',
                        role: blog.user?.role ?? 'Autor'
                    };
                    return responseDto;
                });
        
        // Calcular metadatos de paginación
        const totalPages = Math.ceil(totalItems / limit);
        
        return {
          items,
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        };
      }
      
      // Obtener blogs y contar total
      const [blogs, totalItems] = await this.blogRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        relations,
      });
      
                  const items = blogs.map(blog => {
                const responseDto = new BlogResponseDto(blog);
                // Agregar información del autor
                responseDto.author = {
                    name: blog.user ? `${blog.user.firstName} ${blog.user.lastName}` : 'Usuario Desconocido',
                    avatar: blog.user?.image || '/images/default-avatar.png',
                    role: blog.user?.role ?? 'Autor'
                };
                return responseDto;
            });
      
      // Calcular metadatos de paginación
      const totalPages = Math.ceil(totalItems / limit);
      
      return {
        items,
        meta: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      this.logger.error(`Error al obtener blogs: ${error.message}`, error.stack);
      throw new HttpException(
        BlogErrors.DATABASE_ERROR,
        BlogErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

    /**
   * Obtiene un blog por su ID
   */
  async findById(id: string, includeSections: boolean = true): Promise<BlogResponseDto> {
    try {
      const relations = includeSections ? ['sections', 'user'] : ['user'];
      
      const blog = await this.blogRepository.findOne({
        where: { id },
        relations,
        ...(includeSections && { 
          order: { sections: { order: 'ASC' }} 
        }),
      });
      
      if (!blog) {
        throw new HttpException(
          BlogErrors.BLOG_NOT_FOUND,
          BlogErrors.BLOG_NOT_FOUND.httpStatus
        );
      }
      
      const responseDto = new BlogResponseDto(blog);
      
      // Agregar información del autor
      responseDto.author = {
        name: blog.user ? `${blog.user.firstName} ${blog.user.lastName}` : 'Usuario Desconocido',
        avatar: blog.user?.image || '/images/default-avatar.png',
        role: blog.user?.role ?? 'Autor'
      };
      
      return responseDto;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener blog por ID: ${error.message}`, error.stack);
      throw new HttpException(
        BlogErrors.DATABASE_ERROR,
        BlogErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

    /**
    /**
   * Obtiene un blog por su slug
   */
  async findBySlug(slug: string, includeSections: boolean = true): Promise<BlogResponseDto> {
    try {
      const relations = includeSections ? ['sections', 'user'] : ['user'];
      
      const blog = await this.blogRepository.findOne({
        where: { slug },
        relations,
        ...(includeSections && { 
          order: { sections: { order: 'ASC' }} 
        }),
      });
      
      if (!blog) {
        throw new HttpException(
          BlogErrors.BLOG_NOT_FOUND,
          BlogErrors.BLOG_NOT_FOUND.httpStatus
        );
      }
      
      const responseDto = new BlogResponseDto(blog);
      
      // Agregar información del autor
      responseDto.author = {
        name: blog.user ? `${blog.user.firstName} ${blog.user.lastName}` : 'Usuario Desconocido',
        avatar: blog.user?.image || '/images/default-avatar.png',
        role: blog.user?.role ?? 'Autor'
      };
      
      return responseDto;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener blog por slug: ${error.message}`, error.stack);
      throw new HttpException(
        BlogErrors.DATABASE_ERROR,
        BlogErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

    /**
     * Obtiene todos los blogs de un usuario
     */
    async findByUserId(userId: string, options: {
        page: number;
        limit: number;
        isActive?: boolean;
        includeSections?: boolean;
    }): Promise<PaginatedResult<BlogResponseDto>> {
        try {
            // Verificar que el usuario existe
            try {
                await this.userService.findById(userId);
            } catch (error) {
                throw new HttpException(
                    BlogErrors.USER_NOT_FOUND,
                    BlogErrors.USER_NOT_FOUND.httpStatus
                );
            }

            // Usar el método findAll con el ID de usuario
            return this.findAll({
                ...options,
                userId,
            });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error al obtener blogs por ID de usuario: ${error.message}`, error.stack);
            throw new HttpException(
                BlogErrors.DATABASE_ERROR,
                BlogErrors.DATABASE_ERROR.httpStatus
            );
        }
    }

    /**
     * Crea un nuevo blog con sus secciones
     */
    async create(createDto: CreateBlogDto): Promise<BlogResponseDto> {
        try {
            // Verificar que el usuario existe
            try {
                await this.userService.findById(createDto.userId);
            } catch (error) {
                if (error instanceof HttpException) {
                    throw new HttpException(
                        BlogErrors.USER_NOT_FOUND,
                        BlogErrors.USER_NOT_FOUND.httpStatus
                    );
                }
                throw error;
            }

            // Si no se proporciona un slug, generarlo a partir del título
            if (!createDto.slug) {
                createDto.slug = this.generateSlug(createDto.title);
            } else {
                // Si se proporciona, asegurarse de que esté en formato de slug
                createDto.slug = this.generateSlug(createDto.slug);
            }

            // Verificar que el slug no exista
            const existingBlog = await this.blogRepository.findOne({
                where: { slug: createDto.slug }
            });

            if (existingBlog) {
                throw new HttpException(
                    BlogErrors.SLUG_ALREADY_EXISTS,
                    BlogErrors.SLUG_ALREADY_EXISTS.httpStatus
                );
            }

            // Extraer las secciones del DTO
            const sectionDtos = createDto.sections || [];
            delete createDto.sections;

            // Crear blog sin secciones
            const newBlog = this.blogRepository.create(createDto);
            const savedBlog = await this.blogRepository.save(newBlog);

            // Crear secciones si existen
            if (sectionDtos.length > 0) {
                await this.createBlogSections(savedBlog.id, sectionDtos);
            }

            // Obtener el blog completo con secciones
            return this.findById(savedBlog.id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error al crear blog: ${error.message}`, error.stack);
            throw new HttpException(
                BlogErrors.DATABASE_ERROR,
                BlogErrors.DATABASE_ERROR.httpStatus
            );
        }
    }

    /**
     * Método privado para crear secciones de blog en lote
     */
    private async createBlogSections(blogId: string, sectionDtos: CreateBlogSectionDto[]): Promise<void> {
        try {
            // Validar cada sección según su tipo
            for (const sectionDto of sectionDtos) {
                this.validateSectionFields(sectionDto);
                sectionDto.blogId = blogId;
            }

            // Crear todas las secciones
            const sections = this.blogSectionRepository.create(sectionDtos);
            await this.blogSectionRepository.save(sections);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Método privado para validar los campos de una sección según su tipo
     */
    private validateSectionFields(sectionDto: CreateBlogSectionDto): void {
        switch (sectionDto.type) {
            case BlogSectionType.PARAGRAPH:
            case BlogSectionType.HEADING:
            case BlogSectionType.SUBHEADING:
                if (!sectionDto.content) {
                    throw new HttpException(
                        {
                            ...BlogErrors.MISSING_REQUIRED_FIELDS,
                            message: `El campo 'content' es requerido para el tipo de sección '${sectionDto.type}'`,
                        },
                        BlogErrors.MISSING_REQUIRED_FIELDS.httpStatus
                    );
                }
                break;
            case BlogSectionType.IMAGE:
                if (!sectionDto.src) {
                    throw new HttpException(
                        {
                            ...BlogErrors.MISSING_REQUIRED_FIELDS,
                            message: `El campo 'src' es requerido para el tipo de sección 'image'`,
                        },
                        BlogErrors.MISSING_REQUIRED_FIELDS.httpStatus
                    );
                }
                if (!sectionDto.alt) {
                    throw new HttpException(
                        {
                            ...BlogErrors.MISSING_REQUIRED_FIELDS,
                            message: `El campo 'alt' es requerido para el tipo de sección 'image'`,
                        },
                        BlogErrors.MISSING_REQUIRED_FIELDS.httpStatus
                    );
                }
                break;
            case BlogSectionType.LIST:
                if (!sectionDto.style) {
                    throw new HttpException(
                        {
                            ...BlogErrors.MISSING_REQUIRED_FIELDS,
                            message: `El campo 'style' es requerido para el tipo de sección 'list'`,
                        },
                        BlogErrors.MISSING_REQUIRED_FIELDS.httpStatus
                    );
                }
                if (!sectionDto.items || sectionDto.items.length === 0) {
                    throw new HttpException(
                        {
                            ...BlogErrors.MISSING_REQUIRED_FIELDS,
                            message: `El campo 'items' es requerido y debe tener al menos un elemento para el tipo de sección 'list'`,
                        },
                        BlogErrors.MISSING_REQUIRED_FIELDS.httpStatus
                    );
                }
                break;
        }
    }

    /**
     * Actualiza un blog existente y sus secciones
     */
    async update(id: string, updateDto: UpdateBlogDto): Promise<BlogResponseDto> {
        try {
            // Verificar que el blog existe
            const existingBlog = await this.blogRepository.findOne({
                where: { id },
                relations: ['sections'],
            });

            if (!existingBlog) {
                throw new HttpException(
                    BlogErrors.BLOG_NOT_FOUND,
                    BlogErrors.BLOG_NOT_FOUND.httpStatus
                );
            }

            // Si se cambia el usuario, verificar que existe
            if (updateDto.userId && updateDto.userId !== existingBlog.userId) {
                try {
                    await this.userService.findById(updateDto.userId);
                } catch (error) {
                    if (error instanceof HttpException) {
                        throw new HttpException(
                            BlogErrors.USER_NOT_FOUND,
                            BlogErrors.USER_NOT_FOUND.httpStatus
                        );
                    }
                    throw error;
                }
            }

            // Si se actualiza el slug o el título
            if (updateDto.slug || (updateDto.title && !updateDto.slug)) {
                let newSlug: string = existingBlog.slug;

                if (updateDto.slug) {
                    newSlug = this.generateSlug(updateDto.slug);
                } else if (updateDto.title) {
                    newSlug = this.generateSlug(updateDto.title);
                }

                // Verificar que el nuevo slug no exista en otro blog
                const blogWithSlug = await this.blogRepository.findOne({
                    where: { slug: newSlug }
                });

                if (blogWithSlug && blogWithSlug.id !== id) {
                    throw new HttpException(
                        BlogErrors.SLUG_ALREADY_EXISTS,
                        BlogErrors.SLUG_ALREADY_EXISTS.httpStatus
                    );
                }

                if (newSlug) {
                    updateDto.slug = newSlug;
                }
            }

            // Extraer las secciones del DTO
            const sectionDtos = updateDto.sections;
            delete updateDto.sections;

            // Actualizar el blog sin las secciones
            await this.blogRepository.update(id, updateDto);

            // Si se proporcionan secciones, manejarlas
            if (sectionDtos && sectionDtos.length > 0) {
                // Eliminar secciones existentes
                if (existingBlog.sections && existingBlog.sections.length > 0) {
                    await this.blogSectionRepository.remove(existingBlog.sections);
                }

                // Crear nuevas secciones
                await this.createBlogSections(id, sectionDtos);
            }

            // Obtener el blog actualizado con secciones
            return this.findById(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error al actualizar blog: ${error.message}`, error.stack);
            throw new HttpException(
                BlogErrors.DATABASE_ERROR,
                BlogErrors.DATABASE_ERROR.httpStatus
            );
        }
    }

    /**
     * Elimina un blog y todas sus secciones
     */
    async delete(id: string): Promise<boolean> {
        try {
            // Verificar que el blog existe
            const existingBlog = await this.blogRepository.findOne({
                where: { id },
                relations: ['sections'],
            });

            if (!existingBlog) {
                throw new HttpException(
                    BlogErrors.BLOG_NOT_FOUND,
                    BlogErrors.BLOG_NOT_FOUND.httpStatus
                );
            }

            // Eliminar el blog (las secciones se eliminarán en cascada)
            await this.blogRepository.remove(existingBlog);

            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error al eliminar blog: ${error.message}`, error.stack);
            throw new HttpException(
                BlogErrors.DATABASE_ERROR,
                BlogErrors.DATABASE_ERROR.httpStatus
            );
        }
    }

    /**
     * Crea una nueva sección para un blog
     */
    async createSection(blogId: string, createDto: CreateBlogSectionDto): Promise<BlogSectionResponseDto> {
        try {
            // Verificar que el blog existe
            const existingBlog = await this.blogRepository.findOne({
                where: { id: blogId }
            });

            if (!existingBlog) {
                throw new HttpException(
                    BlogErrors.BLOG_NOT_FOUND,
                    BlogErrors.BLOG_NOT_FOUND.httpStatus
                );
            }

            // Validar los campos según el tipo de sección
            this.validateSectionFields(createDto);

            // Asignar el ID del blog
            createDto.blogId = blogId;

            // Crear sección
            const newSection = this.blogSectionRepository.create(createDto);
            const savedSection = await this.blogSectionRepository.save(newSection);

            return new BlogSectionResponseDto(savedSection);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error al crear sección de blog: ${error.message}`, error.stack);
            throw new HttpException(
                BlogErrors.DATABASE_ERROR,
                BlogErrors.DATABASE_ERROR.httpStatus
            );
        }
    }

    /**
     * Actualiza una sección de blog existente
     */
    async updateSection(sectionId: string, updateDto: UpdateBlogSectionDto): Promise<BlogSectionResponseDto> {
        try {
            // Verificar que la sección existe
            const existingSection = await this.blogSectionRepository.findOne({
                where: { id: sectionId },
                relations: ['blog'],
            });

            if (!existingSection) {
                throw new HttpException(
                    BlogErrors.BLOG_SECTION_NOT_FOUND,
                    BlogErrors.BLOG_SECTION_NOT_FOUND.httpStatus
                );
            }

            // Si se cambia el tipo, validar los campos según el nuevo tipo
            if (updateDto.type && updateDto.type !== existingSection.type) {
                const mergedDto = {
                    ...existingSection,
                    ...updateDto,
                };
                this.validateSectionFields(mergedDto as CreateBlogSectionDto);
            }

            // Si se cambia el blog, verificar que existe
            if (updateDto.blogId && updateDto.blogId !== existingSection.blogId) {
                const blog = await this.blogRepository.findOne({
                    where: { id: updateDto.blogId }
                });

                if (!blog) {
                    throw new HttpException(
                        BlogErrors.BLOG_NOT_FOUND,
                        BlogErrors.BLOG_NOT_FOUND.httpStatus
                    );
                }
            }

            // Actualizar sección
            await this.blogSectionRepository.update(sectionId, updateDto);

            // Obtener la sección actualizada
            const updatedSection = await this.blogSectionRepository.findOne({
                where: { id: sectionId },
                relations: ['blog'],
            });

            if (!updatedSection) {
                throw new HttpException(
                    BlogErrors.BLOG_SECTION_NOT_FOUND,
                    BlogErrors.BLOG_SECTION_NOT_FOUND.httpStatus
                );
            }


            return new BlogSectionResponseDto(updatedSection);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error al actualizar sección de blog: ${error.message}`, error.stack);
            throw new HttpException(
                BlogErrors.DATABASE_ERROR,
                BlogErrors.DATABASE_ERROR.httpStatus
            );
        }
    }

    /**
     * Elimina una sección de blog
     */
    async deleteSection(sectionId: string): Promise<boolean> {
        try {
            // Verificar que la sección existe
            const existingSection = await this.blogSectionRepository.findOne({
                where: { id: sectionId }
            });

            if (!existingSection) {
                throw new HttpException(
                    BlogErrors.BLOG_SECTION_NOT_FOUND,
                    BlogErrors.BLOG_SECTION_NOT_FOUND.httpStatus
                );
            }

            // Eliminar sección
            await this.blogSectionRepository.remove(existingSection);

            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error al eliminar sección de blog: ${error.message}`, error.stack);
            throw new HttpException(
                BlogErrors.DATABASE_ERROR,
                BlogErrors.DATABASE_ERROR.httpStatus
            );
        }
    }

    /**
     * Reordena las secciones de un blog
     */
    async reorderSections(blogId: string, sectionIds: string[]): Promise<BlogResponseDto> {
        try {
            // Verificar que el blog existe
            const blog = await this.blogRepository.findOne({
                where: { id: blogId },
                relations: ['sections'],
            });

            if (!blog) {
                throw new HttpException(
                    BlogErrors.BLOG_NOT_FOUND,
                    BlogErrors.BLOG_NOT_FOUND.httpStatus
                );
            }

            // Verificar que todas las secciones pertenecen al blog
            const sections = await this.blogSectionRepository.find({
                where: { id: In(sectionIds), blogId },
            });

            if (sections.length !== sectionIds.length) {
                throw new HttpException(
                    {
                        ...BlogErrors.BLOG_SECTION_NOT_FOUND,
                        message: 'Una o más secciones no existen o no pertenecen a este blog',
                    },
                    BlogErrors.BLOG_SECTION_NOT_FOUND.httpStatus
                );
            }

            // Actualizar el orden de las secciones
            const updates = sectionIds.map((id, index) => ({
                id,
                order: index,
            }));

            for (const update of updates) {
                await this.blogSectionRepository.update(update.id, { order: update.order });
            }

            // Obtener el blog actualizado con secciones
            return this.findById(blogId);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error al reordenar secciones de blog: ${error.message}`, error.stack);
            throw new HttpException(
                BlogErrors.DATABASE_ERROR,
                BlogErrors.DATABASE_ERROR.httpStatus
            );
        }
    }

    /**
     * Utilidad para generar slugs a partir de textos
     */
    private generateSlug(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')       // Reemplaza espacios con guiones
            .replace(/[^\w\-]+/g, '')   // Elimina caracteres no permitidos
            .replace(/\-\-+/g, '-')     // Reemplaza múltiples guiones con uno solo
            .replace(/^-+/, '')         // Elimina guiones al inicio
            .replace(/-+$/, '');        // Elimina guiones al final
    }
}
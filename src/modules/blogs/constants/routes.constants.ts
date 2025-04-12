
/**
 * Constantes de rutas del módulo de blogs
 * 
 * Define las rutas disponibles en el módulo para documentación y referencia.
 */
export const BLOGS_ROUTES = {
    // Rutas base
    BASE: 'blogs',
    
    // Rutas públicas
    GET_ALL: '/',
    GET_BY_ID: '/:id',
    GET_BY_SLUG: '/slug/:slug',
    GET_BY_USER: '/user/:userId',
    CREATE: '/',
    UPDATE: '/:id',
    DELETE: '/:id',
    
    // Rutas de secciones
    SECTIONS_BASE: '/:blogId/sections',
    SECTIONS_GET_ALL: '/:blogId/sections',
    SECTIONS_GET_BY_ID: '/:blogId/sections/:sectionId',
    SECTIONS_CREATE: '/:blogId/sections',
    SECTIONS_UPDATE: '/:blogId/sections/:sectionId',
    SECTIONS_DELETE: '/:blogId/sections/:sectionId',
    SECTIONS_REORDER: '/:blogId/sections/reorder',
    
    // Rutas con parámetros (ejemplos de uso)
    GET_BY_ID_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    GET_BY_SLUG_EXAMPLE: '/slug/como-implementar-nestjs-con-typeorm',
    GET_BY_USER_EXAMPLE: '/user/123e4567-e89b-12d3-a456-426614174000',
    UPDATE_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    DELETE_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
  };
  
  /**
   * Métodos HTTP utilizados en las rutas
   */
  export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  };
  
  /**
   * Rutas completas para uso en la documentación
   */
  export const FULL_ROUTES = {
    GET_ALL_BLOGS: `${HTTP_METHODS.GET} /api/${BLOGS_ROUTES.BASE}`,
    GET_BLOG_BY_ID: `${HTTP_METHODS.GET} /api/${BLOGS_ROUTES.BASE}/:id`,
    GET_BLOG_BY_SLUG: `${HTTP_METHODS.GET} /api/${BLOGS_ROUTES.BASE}/slug/:slug`,
    GET_BLOGS_BY_USER: `${HTTP_METHODS.GET} /api/${BLOGS_ROUTES.BASE}/user/:userId`,
    CREATE_BLOG: `${HTTP_METHODS.POST} /api/${BLOGS_ROUTES.BASE}`,
    UPDATE_BLOG: `${HTTP_METHODS.PUT} /api/${BLOGS_ROUTES.BASE}/:id`,
    DELETE_BLOG: `${HTTP_METHODS.DELETE} /api/${BLOGS_ROUTES.BASE}/:id`,
    
    GET_ALL_SECTIONS: `${HTTP_METHODS.GET} /api/${BLOGS_ROUTES.BASE}/:blogId/sections`,
    GET_SECTION_BY_ID: `${HTTP_METHODS.GET} /api/${BLOGS_ROUTES.BASE}/:blogId/sections/:sectionId`,
    CREATE_SECTION: `${HTTP_METHODS.POST} /api/${BLOGS_ROUTES.BASE}/:blogId/sections`,
    UPDATE_SECTION: `${HTTP_METHODS.PUT} /api/${BLOGS_ROUTES.BASE}/:blogId/sections/:sectionId`,
    DELETE_SECTION: `${HTTP_METHODS.DELETE} /api/${BLOGS_ROUTES.BASE}/:blogId/sections/:sectionId`,
    REORDER_SECTIONS: `${HTTP_METHODS.PATCH} /api/${BLOGS_ROUTES.BASE}/:blogId/sections/reorder`,
  };
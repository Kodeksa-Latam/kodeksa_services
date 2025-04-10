/**
 * Constantes de rutas del módulo de currículums
 * 
 * Define las rutas disponibles en el módulo para documentación y referencia.
 */
export const CURRICULUM_ROUTES = {
    // Rutas base
    BASE: 'curriculums',
    
    // Rutas públicas
    GET_BY_ID: '/:id',
    GET_BY_USER_ID: '/user/:userId',
    CREATE: '/',
    UPDATE: '/:id',
    DELETE: '/:id',
    
    // Rutas con parámetros (ejemplos de uso)
    GET_BY_ID_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    GET_BY_USER_ID_EXAMPLE: '/user/123e4567-e89b-12d3-a456-426614174000',
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
    DELETE: 'DELETE',
  };
  
  /**
   * Rutas completas para uso en la documentación
   */
  export const FULL_ROUTES = {
    GET_CURRICULUM_BY_ID: `${HTTP_METHODS.GET} /api/${CURRICULUM_ROUTES.BASE}/:id`,
    GET_CURRICULUM_BY_USER_ID: `${HTTP_METHODS.GET} /api/${CURRICULUM_ROUTES.BASE}/user/:userId`,
    CREATE_CURRICULUM: `${HTTP_METHODS.POST} /api/${CURRICULUM_ROUTES.BASE}`,
    UPDATE_CURRICULUM: `${HTTP_METHODS.PUT} /api/${CURRICULUM_ROUTES.BASE}/:id`,
    DELETE_CURRICULUM: `${HTTP_METHODS.DELETE} /api/${CURRICULUM_ROUTES.BASE}/:id`,
  };
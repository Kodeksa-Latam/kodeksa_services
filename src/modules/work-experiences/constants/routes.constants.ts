/**
 * Constantes de rutas del módulo de experiencias laborales
 * 
 * Define las rutas disponibles en el módulo para documentación y referencia.
 */
export const WORK_EXPERIENCES_ROUTES = {
    // Rutas base
    BASE: 'work-experiences',
    
    // Rutas públicas
    GET_ALL: '/',
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
    GET_ALL_WORK_EXPERIENCES: `${HTTP_METHODS.GET} /api/${WORK_EXPERIENCES_ROUTES.BASE}`,
    GET_WORK_EXPERIENCE_BY_ID: `${HTTP_METHODS.GET} /api/${WORK_EXPERIENCES_ROUTES.BASE}/:id`,
    GET_WORK_EXPERIENCES_BY_USER_ID: `${HTTP_METHODS.GET} /api/${WORK_EXPERIENCES_ROUTES.BASE}/user/:userId`,
    CREATE_WORK_EXPERIENCE: `${HTTP_METHODS.POST} /api/${WORK_EXPERIENCES_ROUTES.BASE}`,
    UPDATE_WORK_EXPERIENCE: `${HTTP_METHODS.PUT} /api/${WORK_EXPERIENCES_ROUTES.BASE}/:id`,
    DELETE_WORK_EXPERIENCE: `${HTTP_METHODS.DELETE} /api/${WORK_EXPERIENCES_ROUTES.BASE}/:id`,
  };
/**
 * Constantes de rutas del módulo de aplicaciones a vacantes
 * 
 * Define las rutas disponibles en el módulo para documentación y referencia.
 */
export const APPLICATIONS_ROUTES = {
    // Rutas base
    BASE: 'applications',
    
    // Rutas públicas
    GET_ALL: '/',
    GET_BY_ID: '/:id',
    GET_BY_VACANCY: '/vacancy/:vacancyId',
    CREATE: '/',
    UPDATE: '/:id',
    UPDATE_STATUS: '/:id/status',
    DELETE: '/:id',
    
    // Rutas con parámetros (ejemplos de uso)
    GET_BY_ID_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    GET_BY_VACANCY_EXAMPLE: '/vacancy/123e4567-e89b-12d3-a456-426614174000',
    UPDATE_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    UPDATE_STATUS_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000/status',
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
    GET_ALL_APPLICATIONS: `${HTTP_METHODS.GET} /api/${APPLICATIONS_ROUTES.BASE}`,
    GET_APPLICATION_BY_ID: `${HTTP_METHODS.GET} /api/${APPLICATIONS_ROUTES.BASE}/:id`,
    GET_APPLICATIONS_BY_VACANCY: `${HTTP_METHODS.GET} /api/${APPLICATIONS_ROUTES.BASE}/vacancy/:vacancyId`,
    CREATE_APPLICATION: `${HTTP_METHODS.POST} /api/${APPLICATIONS_ROUTES.BASE}`,
    UPDATE_APPLICATION: `${HTTP_METHODS.PUT} /api/${APPLICATIONS_ROUTES.BASE}/:id`,
    UPDATE_APPLICATION_STATUS: `${HTTP_METHODS.PATCH} /api/${APPLICATIONS_ROUTES.BASE}/:id/status`,
    DELETE_APPLICATION: `${HTTP_METHODS.DELETE} /api/${APPLICATIONS_ROUTES.BASE}/:id`,
  };
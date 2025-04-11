/**
 * Constantes de rutas del módulo de vacantes
 * 
 * Define las rutas disponibles en el módulo para documentación y referencia.
 */
export const VACANCIES_ROUTES = {
    // Rutas base
    BASE: 'vacancies',
    
    // Rutas públicas
    GET_ALL: '/',
    GET_BY_ID: '/:id',
    GET_BY_SLUG: '/slug/:slug',
    CREATE: '/',
    UPDATE: '/:id',
    DELETE: '/:id',
    CHANGE_STATUS: '/:id/status',
    
    // Rutas con parámetros (ejemplos de uso)
    GET_BY_ID_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    GET_BY_SLUG_EXAMPLE: '/slug/desarrollador-full-stack',
    UPDATE_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    DELETE_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    CHANGE_STATUS_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000/status',
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
    GET_ALL_VACANCIES: `${HTTP_METHODS.GET} /api/${VACANCIES_ROUTES.BASE}`,
    GET_VACANCY_BY_ID: `${HTTP_METHODS.GET} /api/${VACANCIES_ROUTES.BASE}/:id`,
    GET_VACANCY_BY_SLUG: `${HTTP_METHODS.GET} /api/${VACANCIES_ROUTES.BASE}/slug/:slug`,
    CREATE_VACANCY: `${HTTP_METHODS.POST} /api/${VACANCIES_ROUTES.BASE}`,
    UPDATE_VACANCY: `${HTTP_METHODS.PUT} /api/${VACANCIES_ROUTES.BASE}/:id`,
    DELETE_VACANCY: `${HTTP_METHODS.DELETE} /api/${VACANCIES_ROUTES.BASE}/:id`,
    CHANGE_VACANCY_STATUS: `${HTTP_METHODS.PATCH} /api/${VACANCIES_ROUTES.BASE}/:id/status`,
  };
/**
 * Constantes de rutas del módulo de habilidades
 * 
 * Define las rutas disponibles en el módulo para documentación y referencia.
 */
export const SKILLS_ROUTES = {
    // Rutas base
    BASE: 'skills',
    
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
    GET_ALL_SKILLS: `${HTTP_METHODS.GET} /api/${SKILLS_ROUTES.BASE}`,
    GET_SKILL_BY_ID: `${HTTP_METHODS.GET} /api/${SKILLS_ROUTES.BASE}/:id`,
    GET_SKILLS_BY_USER_ID: `${HTTP_METHODS.GET} /api/${SKILLS_ROUTES.BASE}/user/:userId`,
    CREATE_SKILL: `${HTTP_METHODS.POST} /api/${SKILLS_ROUTES.BASE}`,
    UPDATE_SKILL: `${HTTP_METHODS.PUT} /api/${SKILLS_ROUTES.BASE}/:id`,
    DELETE_SKILL: `${HTTP_METHODS.DELETE} /api/${SKILLS_ROUTES.BASE}/:id`,
  };
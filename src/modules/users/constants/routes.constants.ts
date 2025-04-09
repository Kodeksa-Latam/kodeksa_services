/**
 * Constantes de rutas del módulo de usuarios
 * 
 * Define las rutas disponibles en el módulo para documentación y referencia.
 */
export const USERS_ROUTES = {
  // Rutas base
  BASE: 'users',
  
  // Rutas públicas
  GET_ALL: '/',
  GET_BY_ID: '/:id',
  GET_BY_SLUG: '/slug/:slug',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
  
  // Rutas con parámetros (ejemplos de uso)
  GET_BY_ID_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
  GET_BY_SLUG_EXAMPLE: '/slug/juan-perez',
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
  GET_ALL_USERS: `${HTTP_METHODS.GET} /api/${USERS_ROUTES.BASE}`,
  GET_USER_BY_ID: `${HTTP_METHODS.GET} /api/${USERS_ROUTES.BASE}/:id`,
  GET_USER_BY_SLUG: `${HTTP_METHODS.GET} /api/${USERS_ROUTES.BASE}/slug/:slug`,
  CREATE_USER: `${HTTP_METHODS.POST} /api/${USERS_ROUTES.BASE}`,
  UPDATE_USER: `${HTTP_METHODS.PUT} /api/${USERS_ROUTES.BASE}/:id`,
  DELETE_USER: `${HTTP_METHODS.DELETE} /api/${USERS_ROUTES.BASE}/:id`,
};
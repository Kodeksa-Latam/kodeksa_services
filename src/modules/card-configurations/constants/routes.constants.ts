/**
 * Constantes de rutas del módulo de configuraciones de tarjeta
 * 
 * Define las rutas disponibles en el módulo para documentación y referencia.
 */
export const CARD_CONFIG_ROUTES = {
    // Rutas base
    BASE: 'card-configurations',
    
    // Rutas públicas
    GET_BY_ID: '/:id',
    GET_BY_USER_ID: '/user/:userId',
    CREATE: '/',
    UPDATE: '/:id',
    DELETE: '/:id',
    RESET: '/:id/reset',
    
    // Rutas con parámetros (ejemplos de uso)
    GET_BY_ID_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    GET_BY_USER_ID_EXAMPLE: '/user/123e4567-e89b-12d3-a456-426614174000',
    UPDATE_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    DELETE_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000',
    RESET_EXAMPLE: '/123e4567-e89b-12d3-a456-426614174000/reset',
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
    GET_CARD_CONFIG_BY_ID: `${HTTP_METHODS.GET} /api/${CARD_CONFIG_ROUTES.BASE}/:id`,
    GET_CARD_CONFIG_BY_USER_ID: `${HTTP_METHODS.GET} /api/${CARD_CONFIG_ROUTES.BASE}/user/:userId`,
    CREATE_CARD_CONFIG: `${HTTP_METHODS.POST} /api/${CARD_CONFIG_ROUTES.BASE}`,
    UPDATE_CARD_CONFIG: `${HTTP_METHODS.PUT} /api/${CARD_CONFIG_ROUTES.BASE}/:id`,
    DELETE_CARD_CONFIG: `${HTTP_METHODS.DELETE} /api/${CARD_CONFIG_ROUTES.BASE}/:id`,
    RESET_CARD_CONFIG: `${HTTP_METHODS.PUT} /api/${CARD_CONFIG_ROUTES.BASE}/:id/reset`,
  };
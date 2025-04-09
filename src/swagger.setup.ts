// swagger.setup.ts
export function setupSwagger(app: any): void {
    try {
      // Usar require en lugar de import para evitar problemas de tipo
      const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
      
      const config = new DocumentBuilder()
        .setTitle('NestJS Users API')
        .setDescription('API para gestión de usuarios')
        .setVersion('1.0')
        .addTag('users')
        .build();
        
      const document = SwaggerModule.createDocument(app, config);
      
      // Usar cast de tipo para evitar errores de TypeScript
      SwaggerModule.setup('api/docs', app, document);
      
      console.log('Swagger documentation configured successfully');
    } catch (error) {
      console.error('Error configuring Swagger:', error.message);
    }
  }
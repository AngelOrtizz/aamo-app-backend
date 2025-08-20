import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe);
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  const config = new DocumentBuilder ()
  .setTitle('Sistema Ventas')
  .setDescription('Sistema ventas (descripcion)')
  .setVersion('1.0')
  .addTag('ventas')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configure CORS to allow requests from the frontend
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://209.38.68.184', 'http://localhost', 'http://localhost:4200'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });
  

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

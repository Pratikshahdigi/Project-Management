import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpException, HttpStatus, ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

// Secure Global Exception Filter to prevent stack traces from reaching clients
@Catch()
export class SecureExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = isHttp 
      ? (exception.getResponse() as any).message || exception.message 
      : 'An unexpected internal server error occurred';

    // Log the actual error stack trace only internally on the server console (Secure Audit Logs)
    console.error(`[AUDIT ERROR LOG] - Path: ${request.url} - Error:`, exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message[0] : message,
      // Stack trace is explicitly omitted for security compliance (OWASP / No internal exposure)
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefixes
  app.setGlobalPrefix('api/v1');

  // Enforce validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Enforce exception filter
  app.useGlobalFilters(new SecureExceptionFilter());

  // Security and limits
  app.enableCors({
    origin: true, // In production, replace with specific tenant origins
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Enable JSON limit parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Agency OS API')
    .setDescription('Complete enterprise operating suite for agency operations')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[Agency OS] Production Backend running on: http://localhost:${port}/api/v1`);
}
bootstrap();

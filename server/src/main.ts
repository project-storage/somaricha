import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Turn off CSP if hosting frontend assets under the same domain, or customise
  }));

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:80',
      'http://localhost:5173',
      'https://somaricha.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global DTO Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Global Exception Handling & Response Enveloping
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new LoggingInterceptor(),
  );

  const config = new DocumentBuilder()
    .setTitle('Somaricha API')
    .setDescription('API for development product somaricha')
    .setVersion('1.0')
    // เพิ่ม JWT Bearer token support
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'JWT-auth', // ชื่อ security scheme
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const document = SwaggerModule.createDocument(app, config);

  // ตั้งค่า Swagger UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // จำ token ไว้เวลา refresh
      docExpansion: 'none', // ปิดการขยาย section อัตโนมัติ
      filter: true, // มีช่องค้นหา
      showRequestDuration: true, // แสดงเวลา request
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

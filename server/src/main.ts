import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

<<<<<<< HEAD
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // if have send cookie/token
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
=======
  // ตั้งค่า Swagger
>>>>>>> develop_backend
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
<<<<<<< HEAD
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
=======

  const document = SwaggerModule.createDocument(app, config);

  // ตั้งค่า Swagger UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // จำ token ไว้เวลา refresh
      docExpansion: 'none',       // ปิดการขยาย section อัตโนมัติ
      filter: true,               // มีช่องค้นหา
      showRequestDuration: true,  // แสดงเวลา request
    },
  });
>>>>>>> develop_backend

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // กำหนด prefix สำหรับ API
  app.setGlobalPrefix('api');

  // CORS config
  const allowedOrigins = [
    'http://localhost:5173',       
    'https://somaricha.vercel.app' 
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // ถ้าไม่มี origin (เช่น curl) ให้อนุญาต
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin ${origin}`));
      }
    },
    credentials: true, // ต้องใช้ถ้าใช้ cookie / JWT
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger / OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle('Somaricha API')
    .setDescription('API for development product Somaricha')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // จำ token ไว้เวลา refresh
      docExpansion: 'none',       // ปิดการขยาย section อัตโนมัติ
      filter: true,               // มีช่องค้นหา
      showRequestDuration: true,  // แสดงเวลา request
    },
  });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();

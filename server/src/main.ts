import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ตั้งค่า Swagger
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

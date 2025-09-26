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
    // เพิ่ม JWT Bearer Auth
    .addBearerAuth(
      { 
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header'
      },
      'access-token', // ใช้ชื่อ key นี้ใน @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // ทำให้ token จำค่าไว้
      docExpansion: 'none', // ปรับ UI: ปิดการขยายทั้งหมดตอนเริ่มต้น
      defaultModelsExpandDepth: -1, // ซ่อน schemas ใน UI
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

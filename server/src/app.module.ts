import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AddressOptionModule } from './address_option/address_option.module';
import { AddressModule } from './address/address.module';
import { Product } from './product/entities/product.entity';
import { Payment } from './payment/entities/payment.entity';
import { Address } from './address/entities/address.entity';
import { AddressOption } from './address_option/entities/address_option.entity';
import { User } from './user/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { HealthController } from './health/health.controller';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ ทำให้ทุก Module ใช้ ENV ได้
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '3306'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [
          Product,
          Payment,
          Address,
          AddressOption,
          User,
          Auth,
          Order,
          OrderItem,
        ],
        synchronize: true,
        migrations: [
          __dirname + '/migrations/**/*{.ts,.js}'
        ],
        migrationsRun: true,
        ssl:
          process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),
    TypeOrmModule.forFeature([
      Product,
      Payment,
      Address,
      AddressOption,
      User,
      Auth,
      Order,
      OrderItem,
    ]),
    ProductModule,
    PaymentModule,
    OrderModule,
    AddressModule,
    AddressOptionModule,
    UserModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    SeederService,
  ],
})
export class AppModule {}
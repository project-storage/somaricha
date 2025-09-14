import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AddressOptionModule } from './address_option/address_option.module';
import { AddressModule } from './address/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/entities/product.entity';
import { Payment } from './payment/entities/payment.entity';
import { Address } from './address/entities/address.entity';
import { AddressOption } from './address_option/entities/address_option.entity';
import { User } from './user/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';
import { Order } from './order/entities/order.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ ทำให้ทุก Module ใช้ ENV ได้
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'somaricha',
      entities: [Product, Payment, Address, AddressOption, User, Auth, Order],
      synchronize: true,
    }),
    ProductModule,
    PaymentModule,
    OrderModule,
    AddressModule,
    AddressOptionModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

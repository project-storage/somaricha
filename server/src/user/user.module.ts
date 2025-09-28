import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
=======
import { User } from './entities/user.entity';
import { AddressOption } from '../address_option/entities/address_option.entity';
import { Address } from '../address/entities/address.entity';
import { Order } from '../order/entities/order.entity';
import { Payment } from '../payment/entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AddressOption, Address, Order, Payment])
  ],
>>>>>>> develop_frontend
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { AddressOptionService } from './address_option.service';
import { AddressOptionController } from './address_option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressOption } from './entities/address_option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressOption])],
  controllers: [AddressOptionController],
  providers: [AddressOptionService],
  exports: [AddressOptionService],
})
export class AddressOptionModule {}

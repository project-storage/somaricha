import { Module } from '@nestjs/common';
import { AddressOptionService } from './address_option.service';
import { AddressOptionController } from './address_option.controller';

@Module({
  controllers: [AddressOptionController],
  providers: [AddressOptionService],
})
export class AddressOptionModule {}

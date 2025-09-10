import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressOptionService } from './address_option.service';
import { CreateAddressOptionDto } from './dto/create-address_option.dto';
import { UpdateAddressOptionDto } from './dto/update-address_option.dto';

@Controller('address-option')
export class AddressOptionController {
  constructor(private readonly addressOptionService: AddressOptionService) {}

  @Post()
  create(@Body() createAddressOptionDto: CreateAddressOptionDto) {
    return this.addressOptionService.create(createAddressOptionDto);
  }

  @Get()
  findAll() {
    return this.addressOptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressOptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressOptionDto: UpdateAddressOptionDto) {
    return this.addressOptionService.update(+id, updateAddressOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressOptionService.remove(+id);
  }
}

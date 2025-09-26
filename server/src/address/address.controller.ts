import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateAddressDto) {
    return this.addressService.create(req.user, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.addressService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.addressService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(+id, dto, req.user);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.addressService.remove(+id, req.user);
  }
}

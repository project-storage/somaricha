import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateAddressOptionDto } from './dto/create-address_option.dto';
import { UpdateAddressOptionDto } from './dto/update-address_option.dto';
import { AddressOptionService } from './address_option.service';

@UseGuards(JwtAuthGuard)
@Controller('address-options')
export class AddressOptionController {
  constructor(private readonly addressOptionService: AddressOptionService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateAddressOptionDto) {
    return this.addressOptionService.create(req.user, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.addressOptionService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.addressOptionService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateAddressOptionDto) {
    return this.addressOptionService.update(+id, dto, req.user);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.addressOptionService.remove(+id, req.user);
  }
}

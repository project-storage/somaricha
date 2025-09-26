import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.orderService.create(req.user, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.orderService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.orderService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(+id, dto, req.user);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.orderService.remove(+id, req.user);
  }
}

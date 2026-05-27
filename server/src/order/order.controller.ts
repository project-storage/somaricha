import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { OrderHistoryResponseDto } from './dto/order-history.dto';
import { MarkOrderReceivedDto } from './dto/mark-order-received.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const user = req.user;
    const addressId = createOrderDto.address_id || createOrderDto.address_option;
    if (!addressId) {
      throw new BadRequestException('address_id or address_option is required');
    }

    const dto = {
      ...createOrderDto,
      user_id: user.id,
      address_id: addressId,
      orderdatetime: createOrderDto.orderdatetime ? new Date(createOrderDto.orderdatetime) : new Date(),
    };
    
    return this.orderService.create(user, dto as any);
  }

  @Get()
  findAll(@Req() req) {
    return this.orderService.findAll(req.user);
  }

  @Get('history')
  findHistory(@Req() req) {
    return this.orderService.findHistory(req.user);
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/all')
  findAllForAdmin() {
    return this.orderService.findAllForAdmin();
  }

  @Get('detail/:id')
  findOneDetail(@Req() req, @Param('id') id: string) {
    return this.orderService.findOneForDetails(+id, req.user);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.orderService.findOneForDetails(+id, req.user);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(+id, dto, req.user);
  }

  @Patch(':id/received')
  markAsReceived(@Req() req, @Param('id') id: string, @Body() dto: MarkOrderReceivedDto) {
    return this.orderService.markAsReceived(+id, req.user, dto.comemnt_star);
  }

  @Patch(':id/confirm-delivery')
  confirmDelivery(@Req() req, @Param('id') id: string) {
    return this.orderService.markAsReceived(+id, req.user);
  }

  // Admin endpoint to update order status
  @UseGuards(AdminAuthGuard)
  @Patch(':id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orderService.updateOrderStatus(+id, status);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.orderService.remove(+id, req.user);
  }
}

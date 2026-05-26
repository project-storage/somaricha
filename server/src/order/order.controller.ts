import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
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
    // Override user_id from the authenticated user, not from the request body
    const user = req.user;
    const dto = {
      ...createOrderDto,
      user_id: user.id, // Ensure the user_id comes from the JWT token, not the request body
    };
    
    return this.orderService.create(user, dto);
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

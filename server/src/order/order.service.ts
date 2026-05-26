import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: { id: number }, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // Validate all products exist
      const productIds = dto.items.map(item => item.product_id);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });
      
      if (products.length !== productIds.length) {
        const foundProductIds = products.map(p => p.id);
        const missingIds = productIds.filter(id => !foundProductIds.includes(id));
        throw new NotFoundException(`Some products not found: ${missingIds.join(', ')}`);
      }
      
      // Get the address for this order
      const address = await tx.address.findUnique({ where: { id: dto.address_id } });
      if (!address) {
        throw new NotFoundException(`Address #${dto.address_id} not found`);
      }
      
      // Check if payment exists
      if (dto.payment_id) {
        const payment = await tx.payment.findUnique({ where: { id: dto.payment_id } });
        if (!payment) throw new NotFoundException(`Payment #${dto.payment_id} not found`);
      }

      // Create the order
      const savedOrder = await tx.order.create({
        data: {
          user_id: user.id,
          status: dto.status as any as OrderStatus,
          orderdatetime: new Date(dto.orderdatetime),
          payment_id: dto.payment_id || null,
          address_id: dto.address_id,
          total_price: dto.total_price,
          comemnt_star: dto.comemnt_star || null,
          order_items: {
            create: dto.items.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              total_price: item.price * item.quantity,
            })),
          },
        },
        include: {
          order_items: { include: { product: true } },
          payment: true,
        },
      });

      return { data: savedOrder };
    });
  }

  async findAll(user: { id: number }) {
    const orders = await this.prisma.order.findMany({
      where: { user_id: user.id },
      include: {
        order_items: { include: { product: true } },
        payment: true,
      },
    });
    return { data: orders };
  }

  async findHistory(user: { id: number }) {
    const orders = await this.prisma.order.findMany({
      where: { user_id: user.id },
      include: {
        order_items: { include: { product: true } },
        address: true,
        user: true,
        payment: true,
      },
      orderBy: { orderdatetime: 'desc' },
    });

    return {
      data: orders.map(order => ({
        id: order.id,
        total_amount: parseFloat(order.total_price.toString()),
        status: order.status,
        order_date: order.orderdatetime,
        created_at: order.created_at,
        updated_at: order.updated_at,
        delivered_at: order.status === OrderStatus.DELIVERED ? order.updated_at : null,
        comemnt_star: order.comemnt_star,
        order_items: order.order_items.map(orderItem => ({
          id: orderItem.id,
          product_name: orderItem.product.product_name,
          product_image: orderItem.product.product_image,
          quantity: orderItem.quantity,
          price: parseFloat(orderItem.price.toString()),
          total_price: parseFloat(orderItem.total_price.toString()),
        })),
        address: {
          recipient_name: `${order.user.user_name} ${order.user.user_lastname}`,
          phone: order.user.tel || 'N/A',
          number: order.address.number,
          road: order.address.road,
          subdistrict: order.address.subdistrict,
          district: order.address.district,
          province: order.address.province,
          code_zip: order.address.code_zip,
          address_detail: order.address.address_detail,
        },
        payment: order.payment ? {
          id: order.payment.id,
        } : null,
      })),
    };
  }

  async findOne(id: number, user: { id: number }) {
    const order = await this.prisma.order.findFirst({
      where: { id, user_id: user.id },
      include: {
        order_items: { include: { product: true } },
        payment: true,
      },
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return { data: order };
  }

  async findOneForDetails(id: number, user: { id: number }) {
    const order = await this.prisma.order.findFirst({
      where: { id, user_id: user.id },
      include: {
        order_items: { include: { product: true } },
        address: true,
        user: true,
        payment: true,
      },
    });
      
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    
    return {
      data: {
        id: order.id,
        total_amount: parseFloat(order.total_price.toString()),
        status: order.status,
        order_date: order.orderdatetime,
        created_at: order.created_at,
        updated_at: order.updated_at,
        delivered_at: order.status === OrderStatus.DELIVERED ? order.updated_at : null,
        comemnt_star: order.comemnt_star,
        order_items: order.order_items.map(orderItem => ({
          id: orderItem.id,
          product_name: orderItem.product.product_name,
          product_image: orderItem.product.product_image,
          quantity: orderItem.quantity,
          price: parseFloat(orderItem.price.toString()),
          total_price: parseFloat(orderItem.total_price.toString()),
        })),
        address: {
          recipient_name: `${order.user.user_name} ${order.user.user_lastname}`,
          phone: order.user.tel || 'N/A',
          number: order.address.number,
          road: order.address.road,
          subdistrict: order.address.subdistrict,
          district: order.address.district,
          province: order.address.province,
          code_zip: order.address.code_zip,
          address_detail: order.address.address_detail,
        },
        payment: order.payment ? {
          id: order.payment.id,
        } : null,
        product: null,
      }
    };
  }

  async update(id: number, dto: UpdateOrderDto, user: { id: number }) {
    await this.findOne(id, user);
    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status as any as OrderStatus,
        comemnt_star: dto.comemnt_star,
      },
    });
    return { data: updated };
  }

  async remove(id: number, user: { id: number }) {
    await this.findOne(id, user);
    await this.prisma.order.delete({ where: { id } });
    return { data: { message: `Order #${id} deleted successfully` } };
  }

  async markAsReceived(id: number, user: { id: number }, comemnt_star?: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, user_id: user.id },
    });
    
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    
    if (order.status !== OrderStatus.SHIPPING && order.status !== OrderStatus.PREPARING) {
      throw new Error(`Cannot mark order as received. Current status: ${order.status}`);
    }
    
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.DELIVERED,
        comemnt_star: comemnt_star !== undefined ? comemnt_star : undefined,
      },
    });
    return { data: updatedOrder };
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.prisma.order.findUnique({ 
      where: { id },
    });
    
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    
    const orderStatusEnum = OrderStatus[status.toUpperCase()];
    if (!orderStatusEnum) {
      throw new Error(`Invalid order status: ${status}`);
    }
    
    if (this.isValidStatusTransition(order.status, orderStatusEnum)) {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status: orderStatusEnum },
      });
      return { data: updatedOrder };
    } else {
      throw new Error(`Invalid status transition from ${order.status} to ${orderStatusEnum}`);
    }
  }

  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PREPARING, OrderStatus.CANCELED],
      [OrderStatus.PREPARING]: [OrderStatus.SHIPPING, OrderStatus.CANCELED],
      [OrderStatus.SHIPPING]: [OrderStatus.DELIVERED, OrderStatus.CANCELED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELED]: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Address } from 'src/address/entities/address.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    private readonly dataSource: DataSource,
  ) {}

  async create(user: User, dto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      // Validate all products exist using standard non-deprecated query
      const productIds = dto.items.map(item => item.product_id);
      const products = await manager.find(Product, {
        where: { id: In(productIds) },
      });
      
      if (products.length !== productIds.length) {
        // Find which products are missing
        const foundProductIds = products.map(p => p.id);
        const missingIds = productIds.filter(id => !foundProductIds.includes(id));
        throw new NotFoundException(`Some products not found: ${missingIds.join(', ')}`);
      }
      
      // Get the address for this order
      const address = await manager.findOne(Address, { where: { id: dto.address_id } });
      if (!address) {
        throw new NotFoundException(`Address #${dto.address_id} not found`);
      }
      
      // Create a map for quick product lookup
      const productMap = new Map(products.map(p => [p.id, p]));
      
      // Validate all items and calculate total
      let calculatedTotal = 0;
      const orderItemsToCreate = dto.items.map(item => {
        const product = productMap.get(item.product_id);
        if (!product) {
          throw new NotFoundException(`Product #${item.product_id} not found`);
        }
        
        const itemTotal = item.price * item.quantity;
        calculatedTotal += itemTotal;
        
        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = item.quantity;
        orderItem.price = item.price;
        orderItem.total_price = itemTotal;
        
        return orderItem;
      });
      
      // Check if payment exists
      let payment: Payment | null = null;
      if (dto.payment_id) {
        payment = await manager.findOne(Payment, { where: { id: dto.payment_id } });
        if (!payment) throw new NotFoundException(`Payment #${dto.payment_id} not found`);
      }

      // Create the order
      const order = manager.create(Order, {
        user,
        status: dto.status,
        orderdatetime: dto.orderdatetime,
        payment: payment ?? undefined,
        address: address,
        total_price: dto.total_price,
        comemnt_star: dto.comemnt_star,
        order_items: orderItemsToCreate,
      });

      const savedOrder = await manager.save(Order, order);
      return { data: savedOrder };
    });
  }

  async findAll(user: User) {
    const orders = await this.orderRepo.find({
      where: { user: { id: user.id } },
      relations: ['product', 'payment'],
    });
    return { data: orders };
  }

  async findHistory(user: User) {
    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.order_items', 'order_item')
      .innerJoinAndSelect('order_item.product', 'product')
      .innerJoinAndSelect('order.address', 'address')
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.payment', 'payment')
      .where('order.user_id = :userId', { userId: user.id })
      .orderBy('order.orderdatetime', 'DESC')
      .getMany();

    return {
      data: orders.map(order => ({
        id: order.id,
        total_amount: order.total_price,
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
          price: orderItem.price,
          total_price: orderItem.total_price,
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
        // Include payment information if needed
        payment: order.payment ? {
          id: order.payment.id,
          // Add other payment fields as needed
        } : null,
      })),
    };
  }

  async findOne(id: number, user: User) {
    const order = await this.orderRepo.findOne({
      where: { id, user: { id: user.id } },
      relations: ['product', 'payment'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return { data: order };
  }

  async findOneForDetails(id: number, user: User) {
    const order = await this.orderRepo
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.order_items', 'order_item')
      .innerJoinAndSelect('order_item.product', 'product')
      .innerJoinAndSelect('order.address', 'address')
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.payment', 'payment')  // Left join for payment since it might be optional
      .where('order.id = :id AND order.user_id = :userId', { id, userId: user.id })
      .getOne();
      
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    
    return {
      data: {
        id: order.id,
        total_amount: order.total_price,
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
          price: orderItem.price,
          total_price: orderItem.total_price,
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
          // Add other payment fields as needed
        } : null,
        product: null, // Remove the single product reference as we now have order_items
      }
    };
  }

  async update(id: number, dto: UpdateOrderDto, user: User) {
    const order = await this.findOne(id, user);
    Object.assign(order.data, dto);
    const updated = await this.orderRepo.save(order.data);
    return { data: updated };
  }

  async remove(id: number, user: User) {
    const order = await this.findOne(id, user);
    await this.orderRepo.remove(order.data);
    return { data: { message: `Order #${id} deleted successfully` } };
  }

  async markAsReceived(id: number, user: User, comemnt_star?: number) {
    const order = await this.orderRepo.findOne({
      where: { id, user: { id: user.id } },
    });
    
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    
    // Only allow marking as received if the order is in shipping status or preparing
    if (order.status !== OrderStatus.SHIPPING && order.status !== OrderStatus.PREPARING) {
      throw new Error(`Cannot mark order as received. Current status: ${order.status}`);
    }
    
    order.status = OrderStatus.DELIVERED;
    if (comemnt_star !== undefined) {
      order.comemnt_star = comemnt_star;
    }
    
    const updatedOrder = await this.orderRepo.save(order);
    return { data: updatedOrder };
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.orderRepo.findOne({ 
      where: { id },
      relations: ['user', 'address'] 
    });
    
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    
    // Convert string status to enum
    const orderStatusEnum = OrderStatus[status.toUpperCase()];
    if (!orderStatusEnum) {
      throw new Error(`Invalid order status: ${status}`);
    }
    
    // Validate the status transition is allowed
    if (this.isValidStatusTransition(order.status, orderStatusEnum)) {
      order.status = orderStatusEnum;
      const updatedOrder = await this.orderRepo.save(order);
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
      [OrderStatus.DELIVERED]: [], // Delivered is final state
      [OrderStatus.CANCELED]: [], // Canceled is final state
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async create(user: User, dto: CreateOrderDto) {
    const product = await this.productRepo.findOne({
      where: { id: dto.product_id },
    });
    if (!product) throw new NotFoundException(`Product #${dto.product_id} not found`);

    let payment: Payment | null = null;
    if (dto.payment_id) {
      payment = await this.paymentRepo.findOne({ where: { id: dto.payment_id } });
      if (!payment) throw new NotFoundException(`Payment #${dto.payment_id} not found`);
    }

    const total_price = Number(product.product_price) * dto.qty;

    const order = this.orderRepo.create({
      product,
      user,
      qty: dto.qty,
      status: OrderStatus.PENDING,
      orderdatetime: new Date(),
      payment: payment ?? undefined,
      total_price,
      comemnt_star: dto.comemnt_star,
    });

    const savedOrder = await this.orderRepo.save(order);
    return { data: savedOrder };
  }

  async findAll(user: User) {
    const orders = await this.orderRepo.find({
      where: { user: { id: user.id } },
      relations: ['product', 'payment'],
    });
    return { data: orders };
  }

  async findOne(id: number, user: User) {
    const order = await this.orderRepo.findOne({
      where: { id, user: { id: user.id } },
      relations: ['product', 'payment'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return { data: order };
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
}

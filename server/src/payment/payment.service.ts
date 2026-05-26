import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const result = await this.prisma.payment.create({
      data: {
        payment_name: dto.payment_name as any as PaymentStatus,
      },
    });
    return { data: result }; 
  }

  async findAll() {
    const payments = await this.prisma.payment.findMany();
    return { data: payments }; 
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    return { data: payment }; 
  }

  async update(id: number, dto: UpdatePaymentDto) {
    await this.findOne(id);
    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        payment_name: dto.payment_name as any as PaymentStatus,
      },
    });
    return { data: updated }; 
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.payment.delete({ where: { id } });
    return { data: { message: `Payment #${id} deleted successfully` } };
  }
}

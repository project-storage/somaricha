import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto) {
    const payment = this.paymentRepository.create(dto);
    const result = await this.paymentRepository.save(payment);
    return { data: result }; 
  }

  async findAll() {
    const payments = await this.paymentRepository.find();
    return { data: payments }; 
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    return { data: payment }; 
  }

  async update(id: number, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);
    Object.assign(payment.data, dto); // payment.data เพราะ findOne คืน { data }
    const updated = await this.paymentRepository.save(payment.data);
    return { data: updated }; 
  }

  async remove(id: number) {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment.data);
    return { data: { message: `Payment #${id} deleted successfully` } };
  }
}

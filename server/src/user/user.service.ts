import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddressOption } from '../address_option/entities/address_option.entity';
import { Address } from '../address/entities/address.entity';
import { Order } from '../order/entities/order.entity';
import { Payment } from '../payment/entities/payment.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AddressOption)
    private addressOptionRepository: Repository<AddressOption>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

async getUserInfo(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['auth', 'addressOptions', 'orders'], 
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['addressOptions', 'addressOptions.addresses', 'orders', 'orders.payment'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addressOptions', 'addressOptions.addresses', 'orders', 'orders.payment'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return await this.userRepository.remove(user);
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'user_name', 'user_lastname', 'email', 'tel', 'created_at', 'updated_at'],
    });

    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    return {
      id: user.id,
      user_name: user.user_name,
      user_lastname: user.user_lastname,
      email: user.email,
      phone: user.tel,
      created_at: user.created_at,
    };
  }

  async updateProfile(userId: number, profileData: Partial<UpdateUserDto>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    Object.assign(user, profileData);
    const updatedUser = await this.userRepository.save(user);

    return {
      id: updatedUser.id,
      user_name: updatedUser.user_name,
      user_lastname: updatedUser.user_lastname,
      email: updatedUser.email,
      phone: updatedUser.tel,
      created_at: updatedUser.created_at,
    };
  }

  async getUserAddresses(userId: number) {
    const addressOptions = await this.addressOptionRepository.find({
      where: { user: { id: userId } },
      relations: ['addresses', 'user'],
    });

    return addressOptions.flatMap((option) =>
      option.addresses.map((address) => ({
        id: address.id,
        user_id: userId,
        recipient_name: option.ao_name,
        phone: option.user?.tel || '',
        address_line1: address.number,
        address_line2: address.address_detail || '',
        district: address.district,
        city: address.province,
        postal_code: address.code_zip.toString(),
        is_default: false,
      })),
    );
  }

  async createUserAddress(userId: number, addressData: any) {
    let addressOption = await this.addressOptionRepository.findOne({
      where: { ao_name: addressData.recipient_name, user: { id: userId } },
    });

    if (!addressOption) {
      addressOption = this.addressOptionRepository.create({
        ao_name: addressData.recipient_name,
        user: { id: userId } as User,
      });
      await this.addressOptionRepository.save(addressOption);
    }

    const newAddress = this.addressRepository.create({
      addressOption: { id: addressOption.id } as AddressOption,
      number: addressData.address_line1,
      address_detail: addressData.address_line2,
      district: addressData.district,
      province: addressData.city,
      code_zip: parseInt(addressData.postal_code),
      road: '',
      subdistrict: '',
    });

    const savedAddress = await this.addressRepository.save(newAddress);

    return {
      id: savedAddress.id,
      user_id: userId,
      recipient_name: addressData.recipient_name,
      phone: addressData.phone,
      address_line1: savedAddress.number,
      address_line2: savedAddress.address_detail || '',
      district: savedAddress.district,
      city: savedAddress.province,
      postal_code: savedAddress.code_zip.toString(),
      is_default: false,
    };
  }

  async updateUserAddress(addressId: number, userId: number, addressData: any) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['addressOption', 'addressOption.user'],
    });

    if (!address || address.addressOption.user.id !== userId) {
      throw new NotFoundException(
        `Address with ID ${addressId} not found or does not belong to user`,
      );
    }

    Object.assign(address, {
      number: addressData.address_line1 ?? address.number,
      address_detail: addressData.address_line2 ?? address.address_detail,
      district: addressData.district ?? address.district,
      province: addressData.city ?? address.province,
      code_zip: addressData.postal_code
        ? parseInt(addressData.postal_code)
        : address.code_zip,
    });

    if (addressData.recipient_name) {
      address.addressOption.ao_name = addressData.recipient_name;
      await this.addressOptionRepository.save(address.addressOption);
    }

    const savedAddress = await this.addressRepository.save(address);

    return {
      id: savedAddress.id,
      user_id: userId,
      recipient_name: addressData.recipient_name || address.addressOption.ao_name,
      phone: addressData.phone,
      address_line1: savedAddress.number,
      address_line2: savedAddress.address_detail || '',
      district: savedAddress.district,
      city: savedAddress.province,
      postal_code: savedAddress.code_zip.toString(),
      is_default: false,
    };
  }

  async deleteUserAddress(addressId: number, userId: number) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['addressOption', 'addressOption.user'],
    });

    if (!address || address.addressOption.user.id !== userId) {
      throw new NotFoundException(
        `Address with ID ${addressId} not found or does not belong to user`,
      );
    }

    await this.addressRepository.remove(address);
    return { message: 'Address deleted successfully' };
  }

  async getUserPayments(userId: number) {
    return [];
  }

  async addUserPayment(userId: number, paymentData: any) {
    return {
      id: 1,
      user_id: userId,
      type: paymentData.type,
      provider: paymentData.provider,
      last_four: paymentData.last_four,
      expiry_month: paymentData.expiry_month,
      expiry_year: paymentData.expiry_year,
      is_default: false,
    };
  }

  async updateUserPayment(paymentId: number, userId: number, paymentData: any) {
    return {
      id: paymentId,
      user_id: userId,
      type: paymentData.type || 'credit_card',
      provider: paymentData.provider || 'Visa',
      last_four: paymentData.last_four || '1234',
      expiry_month: paymentData.expiry_month || '12',
      expiry_year: paymentData.expiry_year || '25',
      is_default: false,
    };
  }

  async deleteUserPayment(paymentId: number, userId: number) {
    return { message: 'Payment method deleted successfully' };
  }

  async setDefaultPayment(paymentId: number, userId: number) {
    return { message: 'Default payment method set successfully' };
  }

  async getUserOrders(userId: number, limit = 10, offset = 0) {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['product', 'payment'],
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      user_id: order.user.id,
      order_number: `ORD-${order.id.toString().padStart(6, '0')}`,
      total_amount: parseFloat(order.total_price.toString()),
      status: order.status.toLowerCase() as
        | 'pending'
        | 'confirmed'
        | 'preparing'
        | 'ready_for_pickup'
        | 'completed'
        | 'cancelled',
      order_date: order.created_at,
      items: [
        {
          id: order.product.id,
          product_name: order.product.product_name,
          quantity: order.qty,
          price: parseFloat(order.total_price.toString()) / order.qty,
        },
      ],
    }));

    return { orders: formattedOrders, total };
  }
}

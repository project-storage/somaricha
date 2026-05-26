import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserInfo(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { auth: true, addressOptions: true, orders: true },
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        user_name: createUserDto.user_name,
        user_lastname: createUserDto.user_lastname,
        email: createUserDto.email,
        tel: createUserDto.tel,
        user_role: createUserDto.user_role as any as UserRole,
        user_birth: createUserDto.user_birth ? new Date(createUserDto.user_birth) : null,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      include: {
        addressOptions: { include: { addresses: true } },
        orders: { include: { payment: true } },
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        addressOptions: { include: { addresses: true } },
        orders: { include: { payment: true } },
      },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return await this.prisma.user.update({
      where: { id },
      data: {
        user_name: updateUserDto.user_name,
        user_lastname: updateUserDto.user_lastname,
        email: updateUserDto.email,
        tel: updateUserDto.tel,
        user_role: updateUserDto.user_role as any as UserRole,
        user_birth: updateUserDto.user_birth ? new Date(updateUserDto.user_birth) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.user.delete({ where: { id } });
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        user_name: true,
        user_lastname: true,
        email: true,
        tel: true,
        created_at: true,
        updated_at: true,
      },
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
    await this.findOne(userId);
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        user_name: profileData.user_name,
        user_lastname: profileData.user_lastname,
        email: profileData.email,
        tel: profileData.tel,
      },
    });

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
    const addressOptions = await this.prisma.addressOption.findMany({
      where: { user_id: userId },
      include: { addresses: true, user: true },
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
    let addressOption = await this.prisma.addressOption.findFirst({
      where: { ao_name: addressData.recipient_name, user_id: userId },
    });

    if (!addressOption) {
      addressOption = await this.prisma.addressOption.create({
        data: {
          ao_name: addressData.recipient_name,
          user_id: userId,
        },
      });
    }

    const savedAddress = await this.prisma.address.create({
      data: {
        ao_id: addressOption.id,
        number: addressData.address_line1,
        address_detail: addressData.address_line2,
        district: addressData.district,
        province: addressData.city,
        code_zip: parseInt(addressData.postal_code),
        road: '',
        subdistrict: '',
      },
    });

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
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
      include: { addressOption: { include: { user: true } } },
    });

    if (!address || address.addressOption.user.id !== userId) {
      throw new NotFoundException(
        `Address with ID ${addressId} not found or does not belong to user`,
      );
    }

    const savedAddress = await this.prisma.address.update({
      where: { id: addressId },
      data: {
        number: addressData.address_line1 ?? address.number,
        address_detail: addressData.address_line2 ?? address.address_detail,
        district: addressData.district ?? address.district,
        province: addressData.city ?? address.province,
        code_zip: addressData.postal_code
          ? parseInt(addressData.postal_code)
          : address.code_zip,
      },
    });

    if (addressData.recipient_name) {
      await this.prisma.addressOption.update({
        where: { id: address.ao_id },
        data: { ao_name: addressData.recipient_name },
      });
    }

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
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
      include: { addressOption: { include: { user: true } } },
    });

    if (!address || address.addressOption.user.id !== userId) {
      throw new NotFoundException(
        `Address with ID ${addressId} not found or does not belong to user`,
      );
    }

    await this.prisma.address.delete({ where: { id: addressId } });
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
    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: { user_id: userId },
        include: {
          user: true,
          order_items: { include: { product: true } },
          payment: true,
        },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.order.count({ where: { user_id: userId } }),
    ]);

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
      items: order.order_items.map((orderItem) => ({
        id: orderItem.product.id,
        product_name: orderItem.product.product_name,
        quantity: orderItem.quantity,
        price: orderItem.price,
      })),
    }));

    return { orders: formattedOrders, total };
  }
}

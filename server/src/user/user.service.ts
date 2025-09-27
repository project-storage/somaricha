import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AddressOption } from '../address_option/entities/address_option.entity';
import { Address } from '../address/entities/address.entity';
import { Order, OrderStatus } from '../order/entities/order.entity';
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

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.user_name = createUserDto.user_name;
    user.user_lastname = createUserDto.user_lastname;
    user.user_birth = createUserDto.user_birth;
    user.user_role = createUserDto.user_role;
    user.tel = createUserDto.tel;
    user.email = createUserDto.email;
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['addressOptions', 'addressOptions.addresses', 'orders', 'orders.payment']
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['addressOptions', 'addressOptions.addresses', 'orders', 'orders.payment']
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return await this.userRepository.remove(user);
  }

  // Get user profile
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'user_name',
        'user_lastname',
        'email',
        'tel',
        'created_at',
        'updated_at'
      ]
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Format the response to match the frontend interface
    return {
      id: user.id,
      user_name: user.user_name,
      user_lastname: user.user_lastname,
      email: user.email,
      phone: user.tel,
      created_at: user.created_at
    };
  }

  // Update user profile
  async updateProfile(userId: number, profileData: Partial<UpdateUserDto>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Only update allowed fields
    if (profileData.user_name) user.user_name = profileData.user_name;
    if (profileData.user_lastname) user.user_lastname = profileData.user_lastname;
    if (profileData.email) user.email = profileData.email;
    if (profileData.tel) user.tel = profileData.tel;

    const updatedUser = await this.userRepository.save(user);

    // Return formatted response to match frontend interface
    return {
      id: updatedUser.id,
      user_name: updatedUser.user_name,
      user_lastname: updatedUser.user_lastname,
      email: updatedUser.email,
      phone: updatedUser.tel,
      created_at: updatedUser.created_at
    };
  }

  // Get user addresses
  async getUserAddresses(userId: number) {
    const addressOptions = await this.addressOptionRepository.find({
      where: { user: { id: userId } },
      relations: ['addresses', 'user']
    });

    const addresses: any[] = [];
    for (const option of addressOptions) {
      for (const address of option.addresses) {
        addresses.push({
          id: address.id,
          user_id: userId,
          recipient_name: option.ao_name,
          phone: option.user?.tel || '',
          address_line1: address.number,
          address_line2: address.address_detail || '',
          district: address.district,
          city: address.province,
          postal_code: address.code_zip.toString(),
          is_default: false // Default status would need to be implemented with additional field
        });
      }
    }
    
    return addresses;
  }

  // Create user address
  async createUserAddress(userId: number, addressData: any) {
    // First, create or get the address option
    let addressOption = await this.addressOptionRepository.findOne({
      where: { ao_name: addressData.recipient_name, user: { id: userId } }
    });

    if (!addressOption) {
      addressOption = new AddressOption();
      addressOption.ao_name = addressData.recipient_name;
      addressOption.user = { id: userId } as User;
      await this.addressOptionRepository.save(addressOption);
    }

    // Create the address
    const newAddress = new Address();
    newAddress.addressOption = { id: addressOption.id } as AddressOption;
    newAddress.number = addressData.address_line1;
    newAddress.address_detail = addressData.address_line2;
    newAddress.district = addressData.district;
    newAddress.province = addressData.city;
    newAddress.code_zip = parseInt(addressData.postal_code);
    newAddress.road = '';
    newAddress.subdistrict = '';
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
      is_default: false
    };
  }

  // Update user address
  async updateUserAddress(addressId: number, userId: number, addressData: any) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['addressOption']
    });

    if (!address || address.addressOption.user.id !== userId) {
      throw new Error(`Address with ID ${addressId} not found or does not belong to user`);
    }

    // Update address fields
    if (addressData.address_line1) address.number = addressData.address_line1;
    if (addressData.address_line2) address.address_detail = addressData.address_line2;
    if (addressData.district) address.district = addressData.district;
    if (addressData.city) address.province = addressData.city;
    if (addressData.postal_code) address.code_zip = parseInt(addressData.postal_code);
    
    // Update address option (recipient name)
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
      is_default: false
    };
  }

  // Delete user address
  async deleteUserAddress(addressId: number, userId: number) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['addressOption']
    });

    if (!address || address.addressOption.user.id !== userId) {
      throw new Error(`Address with ID ${addressId} not found or does not belong to user`);
    }

    await this.addressRepository.remove(address);
    return { message: 'Address deleted successfully' };
  }

  // Get user payment methods
  async getUserPayments(userId: number) {
    // For now, we'll return basic payment information
    // In a real implementation, you would have a dedicated payment methods table
    // Here's a placeholder response that matches the frontend interface
    return [];
  }

  // Add user payment method
  async addUserPayment(userId: number, paymentData: any) {
    // In a real implementation, you would create a payment method record
    // For now, just return a success message
    return {
      id: 1, // In a real implementation, this would be the actual ID
      user_id: userId,
      type: paymentData.type,
      provider: paymentData.provider,
      last_four: paymentData.last_four,
      expiry_month: paymentData.expiry_month,
      expiry_year: paymentData.expiry_year,
      is_default: false
    };
  }

  // Update user payment method
  async updateUserPayment(paymentId: number, userId: number, paymentData: any) {
    // In a real implementation, you would update the payment method record
    // For now, just return a success message
    return {
      id: paymentId,
      user_id: userId,
      type: paymentData.type || 'credit_card',
      provider: paymentData.provider || 'Visa',
      last_four: paymentData.last_four || '1234',
      expiry_month: paymentData.expiry_month || '12',
      expiry_year: paymentData.expiry_year || '25',
      is_default: false
    };
  }

  // Delete user payment method
  async deleteUserPayment(paymentId: number, userId: number) {
    // In a real implementation, you would delete the payment method record
    // For now, just return a success message
    return { message: 'Payment method deleted successfully' };
  }

  // Set default payment method
  async setDefaultPayment(paymentId: number, userId: number) {
    // In a real implementation, you would update the default payment method in the database
    // For now, just return a success message
    return { message: 'Default payment method set successfully' };
  }

  // Get user order history
  async getUserOrders(userId: number, limit: number = 10, offset: number = 0) {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['product', 'payment'],
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      user_id: order.user.id,
      order_number: `ORD-${order.id.toString().padStart(6, '0')}`,
      total_amount: parseFloat(order.total_price.toString()),
      status: order.status.toLowerCase() as 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'completed' | 'cancelled',
      order_date: order.created_at,
      items: [{
        id: order.product.id,
        product_name: order.product.product_name,
        quantity: order.qty,
        price: parseFloat(order.total_price.toString()) / order.qty
      }]
    }));

    return {
      orders: formattedOrders,
      total
    };
  }
}

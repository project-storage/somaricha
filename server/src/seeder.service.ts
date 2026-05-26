import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Product } from './product/entities/product.entity';
import { ProductStatus } from './product/dto/create-product.dto';
import { User, UserRole } from './user/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';
import { AddressOption } from './address_option/entities/address_option.entity';
import { Address } from './address/entities/address.entity';
import { Order, OrderStatus } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';
import { Payment } from './payment/entities/payment.entity';
import { PaymentStatus } from './payment/dto/create-payment.dto';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(AddressOption)
    private readonly addressOptionRepository: Repository<AddressOption>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async onModuleInit() {
    try {
      const userCount = await this.userRepository.count();
      if (userCount === 0) {
        console.log('[System Seeder] Database is empty. Running system-wide mockup seed...');
        await this.seedAll();
        console.log('[System Seeder] Successfully completed system-wide seed!');
      } else {
        console.log('[System Seeder] Users already exist. Skipping seed.');
      }
    } catch (error) {
      console.error('[System Seeder] Error running database seeder:', error.message);
    }
  }

  private async seedAll() {
    // 1. Seed Products
    console.log('[System Seeder] Seeding premium mock products...');
    const mockProductsData = [
      {
        product_name: 'ชาพีชหญ้าหวาน (Somari Peach Tea)',
        product_detail: 'ชาพีชแท้รสชาติหอมหวานอมเปรี้ยวลงตัว ใช้ใบชาพรีเมียมต้มสดใหม่ทุกวัน เพิ่มความหวานธรรมชาติด้วยหญ้าหวานญี่ปุ่นแท้ 100% ตอบโจทย์คนรักสุขภาพ',
        product_price: 65.00,
        product_image: '/assets/Chapeach.png',
        product_status: ProductStatus.IN_STOCK,
      },
      {
        product_name: 'ชาสตรอว์เบอร์รี่สด (Somari Strawberry Tea)',
        product_detail: 'ชาผลไม้รสสตรอว์เบอร์รี่จากสตรอว์เบอร์รี่สดคัดเกรด รสชาติเปรี้ยวหวานสดชื่น ดับกระหายคลายร้อน อุดมไปด้วยวิตามินซีสูง หวานน้อยด้วยหญ้าหวานญี่ปุ่น',
        product_price: 70.00,
        product_image: '/assets/Imagepage.png',
        product_status: ProductStatus.IN_STOCK,
      },
      {
        product_name: 'ชากีวี่มะนาว (Somari Kiwi Lemon Tea)',
        product_detail: 'ชาเขียวมะลิคัดพิเศษผสานน้ำกีวี่เข้มข้นและน้ำมะนาวคั้นสด รสชาติเปรี้ยวจี๊ดจ๊าดสะใจ เหมาะสำหรับผู้ที่ต้องการความกระปรี้กระเปร่าระหว่างวัน',
        product_price: 75.00,
        product_image: '/assets/Imagepage.png',
        product_status: ProductStatus.IN_STOCK,
      },
      {
        product_name: 'ชาเสาวรสฮันนี่ (Somari Passion Fruit Tea)',
        product_detail: 'ชาดำซีลอนผสมน้ำเสาวรสแท้ กลิ่นหอมเป็นเอกลักษณ์ ให้รสชาติเปรี้ยวหวานกลมกล่อมลงตัว ได้ประโยชน์จากเนื้อเสาวรสสดแท้เต็มคำ',
        product_price: 65.00,
        product_image: '/assets/Imagepage.png',
        product_status: ProductStatus.IN_STOCK,
      },
      {
        product_name: 'ชามะม่วงสุกหญ้าหวาน (Somari Mango Tea)',
        product_detail: 'ชาผลไม้สูตรพิเศษผสมเนื้อมะม่วงสุกหอมหวานละมุน ชื่นใจสไตล์เขตร้อน อร่อยแบบสุขภาพดีเพราะไม่เติมน้ำตาลทรายแดง',
        product_price: 75.00,
        product_image: '/assets/Imagepage.png',
        product_status: ProductStatus.IN_STOCK,
      },
    ];

    const products = await this.productRepository.save(
      this.productRepository.create(mockProductsData)
    );

    // 2. Seed Users & Auths
    console.log('[System Seeder] Seeding user and owner accounts...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Owner (Shop Admin)
    const ownerUser = this.userRepository.create({
      user_name: 'สมชาย',
      user_lastname: 'เจ้าของร้าน',
      email: 'owner@somaricha.com',
      tel: '0812345678',
      user_role: UserRole.OWNER,
      user_birth: new Date('1990-01-01'),
    });
    const savedOwner = await this.userRepository.save(ownerUser);

    const ownerAuth = this.authRepository.create({
      username: 'owner',
      password: hashedPassword,
      user: savedOwner,
    });
    await this.authRepository.save(ownerAuth);

    // Customer
    const customerUser = this.userRepository.create({
      user_name: 'สมสิริ',
      user_lastname: 'รักษ์ดี',
      email: 'customer@somaricha.com',
      tel: '0898765432',
      user_role: UserRole.USER,
      user_birth: new Date('1995-05-15'),
    });
    const savedCustomer = await this.userRepository.save(customerUser);

    const customerAuth = this.authRepository.create({
      username: 'customer',
      password: hashedPassword,
      user: savedCustomer,
    });
    await this.authRepository.save(customerAuth);

    // 3. Seed AddressOptions & Addresses
    console.log('[System Seeder] Seeding shipping addresses...');
    
    // Address Option 1: Home
    const homeOption = this.addressOptionRepository.create({
      ao_name: 'บ้านคุณแม่',
      user: savedCustomer,
    });
    const savedHomeOption = await this.addressOptionRepository.save(homeOption);

    const homeAddress = this.addressRepository.create({
      addressOption: savedHomeOption,
      number: '123/45',
      road: 'มาลัยแมน',
      subdistrict: 'นครปฐม',
      district: 'เมืองนครปฐม',
      province: 'นครปฐม',
      code_zip: 73000,
      address_detail: 'ตรงข้ามมหาวิทยาลัยราชภัฏนครปฐม',
      recipient_name: 'คุณแม่ รักษ์ดี',
      phone: '0898765432',
    });
    const savedHomeAddress = await this.addressRepository.save(homeAddress);

    // Address Option 2: Office
    const officeOption = this.addressOptionRepository.create({
      ao_name: 'ที่ทำงาน',
      user: savedCustomer,
    });
    const savedOfficeOption = await this.addressOptionRepository.save(officeOption);

    const officeAddress = this.addressRepository.create({
      addressOption: savedOfficeOption,
      number: '85/10',
      road: 'พญาไท',
      subdistrict: 'พญาไท',
      district: 'ราชเทวี',
      province: 'กรุงเทพมหานคร',
      code_zip: 10400,
      address_detail: 'ตึกพญาไทพลาซ่า ชั้น 15',
      recipient_name: 'สมสิริ รักษ์ดี (ทำงาน)',
      phone: '0898765432',
    });
    const savedOfficeAddress = await this.addressRepository.save(officeAddress);

    // 4. Seed Mockup Orders, Items & Payments
    console.log('[System Seeder] Seeding historical analytics orders...');

    // Order 1: Completed (Mobile Banking payment)
    const payment1 = this.paymentRepository.create({
      payment_name: PaymentStatus.MOBILE_BANKING,
    });
    const savedPayment1 = await this.paymentRepository.save(payment1);

    const order1 = this.orderRepository.create({
      user: savedCustomer,
      status: OrderStatus.DELIVERED,
      orderdatetime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      payment: savedPayment1,
      address: savedHomeAddress,
      total_price: 150.00, // (65 * 2) + 20 shipping
      comemnt_star: 5,
    });
    const savedOrder1 = await this.orderRepository.save(order1);

    const orderItem1 = this.orderItemRepository.create({
      order: savedOrder1,
      product: products[0], // Peach Tea
      quantity: 2,
      price: 65.00,
      total_price: 130.00,
    });
    await this.orderItemRepository.save(orderItem1);

    // Order 2: Preparing (Credit Card payment)
    const payment2 = this.paymentRepository.create({
      payment_name: PaymentStatus.CREDIT_CARD,
    });
    const savedPayment2 = await this.paymentRepository.save(payment2);

    const order2 = this.orderRepository.create({
      user: savedCustomer,
      status: OrderStatus.PREPARING,
      orderdatetime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      payment: savedPayment2,
      address: savedOfficeAddress,
      total_price: 165.00, // 70 (Strawberry) + 75 (Mango) + 20 shipping
    });
    const savedOrder2 = await this.orderRepository.save(order2);

    const orderItem2_1 = this.orderItemRepository.create({
      order: savedOrder2,
      product: products[1], // Strawberry
      quantity: 1,
      price: 70.00,
      total_price: 70.00,
    });
    const orderItem2_2 = this.orderItemRepository.create({
      order: savedOrder2,
      product: products[4], // Mango
      quantity: 1,
      price: 75.00,
      total_price: 75.00,
    });
    await this.orderItemRepository.save(orderItem2_1);
    await this.orderItemRepository.save(orderItem2_2);

    // Order 3: Pending (Cash payment)
    const payment3 = this.paymentRepository.create({
      payment_name: PaymentStatus.ONLY_CASE,
    });
    const savedPayment3 = await this.paymentRepository.save(payment3);

    const order3 = this.orderRepository.create({
      user: savedCustomer,
      status: OrderStatus.PENDING,
      orderdatetime: new Date(), // Just now
      payment: savedPayment3,
      address: savedHomeAddress,
      total_price: 95.00, // 75 (Kiwi) + 20 shipping
    });
    const savedOrder3 = await this.orderRepository.save(order3);

    const orderItem3 = this.orderItemRepository.create({
      order: savedOrder3,
      product: products[2], // Kiwi Lemon
      quantity: 1,
      price: 75.00,
      total_price: 75.00,
    });
    await this.orderItemRepository.save(orderItem3);
  }
}

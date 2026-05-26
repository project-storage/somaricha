import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma/prisma.service';
import { UserRole, ProductStatus, OrderStatus, PaymentStatus, Product } from '@prisma/client';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const userCount = await this.prisma.user.count();
      if (userCount === 0) {
        console.log('[Prisma Seeder] Database is empty. Running system-wide mockup seed...');
        await this.seedAll();
        console.log('[Prisma Seeder] Successfully completed system-wide seed!');
      } else {
        console.log('[Prisma Seeder] Users already exist. Skipping seed.');
      }
    } catch (error) {
      console.error('[Prisma Seeder] Error running database seeder:', error.message);
    }
  }

  private async seedAll() {
    // 1. Seed Products
    console.log('[Prisma Seeder] Seeding premium mock products...');
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

    const products: Product[] = [];
    for (const pData of mockProductsData) {
      const p = await this.prisma.product.create({ data: pData });
      products.push(p);
    }

    // 2. Seed Users & Auths
    console.log('[Prisma Seeder] Seeding user and owner accounts...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Owner (Shop Admin)
    const savedOwner = await this.prisma.user.create({
      data: {
        user_name: 'สมชาย',
        user_lastname: 'เจ้าของร้าน',
        email: 'owner@somaricha.com',
        tel: '0812345678',
        user_role: UserRole.OWNER,
        user_birth: new Date('1990-01-01'),
        auth: {
          create: {
            username: 'owner',
            password: hashedPassword,
          },
        },
      },
    });

    // Customer
    const savedCustomer = await this.prisma.user.create({
      data: {
        user_name: 'สมสิริ',
        user_lastname: 'รักษ์ดี',
        email: 'customer@somaricha.com',
        tel: '0898765432',
        user_role: UserRole.USER,
        user_birth: new Date('1995-05-15'),
        auth: {
          create: {
            username: 'customer',
            password: hashedPassword,
          },
        },
      },
    });

    // 3. Seed AddressOptions & Addresses
    console.log('[Prisma Seeder] Seeding shipping addresses...');
    
    // Address Option 1: Home
    const savedHomeOption = await this.prisma.addressOption.create({
      data: {
        ao_name: 'บ้านคุณแม่',
        user_id: savedCustomer.id,
      },
    });

    const savedHomeAddress = await this.prisma.address.create({
      data: {
        ao_id: savedHomeOption.id,
        number: '123/45',
        road: 'มาลัยแมน',
        subdistrict: 'นครปฐม',
        district: 'เมืองนครปฐม',
        province: 'นครปฐม',
        code_zip: 73000,
        address_detail: 'ตรงข้ามมหาวิทยาลัยราชภัฏนครปฐม',
        recipient_name: 'คุณแม่ รักษ์ดี',
        phone: '0898765432',
      },
    });

    // Address Option 2: Office
    const savedOfficeOption = await this.prisma.addressOption.create({
      data: {
        ao_name: 'ที่ทำงาน',
        user_id: savedCustomer.id,
      },
    });

    const savedOfficeAddress = await this.prisma.address.create({
      data: {
        ao_id: savedOfficeOption.id,
        number: '85/10',
        road: 'พญาไท',
        subdistrict: 'พญาไท',
        district: 'ราชเทวี',
        province: 'กรุงเทพมหานคร',
        code_zip: 10400,
        address_detail: 'ตึกพญาไทพลาซ่า ชั้น 15',
        recipient_name: 'สมสิริ รักษ์ดี (ทำงาน)',
        phone: '0898765432',
      },
    });

    // 4. Seed Mockup Orders, Items & Payments
    console.log('[Prisma Seeder] Seeding historical analytics orders...');

    // Order 1: Completed (Mobile Banking payment)
    const savedPayment1 = await this.prisma.payment.create({
      data: { payment_name: PaymentStatus.MOBILE_BANKING },
    });

    await this.prisma.order.create({
      data: {
        user_id: savedCustomer.id,
        status: OrderStatus.DELIVERED,
        orderdatetime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        payment_id: savedPayment1.id,
        address_id: savedHomeAddress.id,
        total_price: 150.00,
        comemnt_star: 5,
        order_items: {
          create: {
            product_id: products[0].id, // Peach Tea
            quantity: 2,
            price: 65.00,
            total_price: 130.00,
          },
        },
      },
    });

    // Order 2: Preparing (Credit Card payment)
    const savedPayment2 = await this.prisma.payment.create({
      data: { payment_name: PaymentStatus.CREDIT_CARD },
    });

    await this.prisma.order.create({
      data: {
        user_id: savedCustomer.id,
        status: OrderStatus.PREPARING,
        orderdatetime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        payment_id: savedPayment2.id,
        address_id: savedOfficeAddress.id,
        total_price: 165.00,
        order_items: {
          create: [
            {
              product_id: products[1].id, // Strawberry
              quantity: 1,
              price: 70.00,
              total_price: 70.00,
            },
            {
              product_id: products[4].id, // Mango
              quantity: 1,
              price: 75.00,
              total_price: 75.00,
            },
          ],
        },
      },
    });

    // Order 3: Pending (Cash payment)
    const savedPayment3 = await this.prisma.payment.create({
      data: { payment_name: PaymentStatus.ONLY_CASE },
    });

    await this.prisma.order.create({
      data: {
        user_id: savedCustomer.id,
        status: OrderStatus.PENDING,
        orderdatetime: new Date(),
        payment_id: savedPayment3.id,
        address_id: savedHomeAddress.id,
        total_price: 95.00,
        order_items: {
          create: {
            product_id: products[2].id, // Kiwi Lemon
            quantity: 1,
            price: 75.00,
            total_price: 75.00,
          },
        },
      },
    });
  }
}

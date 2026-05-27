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
        console.log('[Prisma Seeder] Database is empty. Running rich mockup system seed...');
        await this.seedAll();
        console.log('[Prisma Seeder] Successfully completed rich mockup seed!');
      } else {
        console.log('[Prisma Seeder] Users already exist. Skipping seed.');
      }
    } catch (error) {
      console.error('[Prisma Seeder] Error running database seeder:', error.message);
    }
  }

  private async seedAll() {
    // 1. Seed Products
    console.log('[Prisma Seeder] Seeding premium mockup products...');
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
    console.log('[Prisma Seeder] Seeding rich customer and owner accounts...');
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

    // Five Customers
    const customerNames = [
      { first: 'สมสิริ', last: 'รักษ์ดี', email: 'customer@somaricha.com', user: 'customer', tel: '0898765432' },
      { first: 'ณัฐพล', last: 'แก้วใจ', email: 'natthapol@example.com', user: 'natthapol', tel: '0823456789' },
      { first: 'พิชญุตม์', last: 'ทองอร่าม', email: 'pichayut@example.com', user: 'pichayut', tel: '0834567890' },
      { first: 'กมลชนก', last: 'มีสุข', email: 'kamolchanok@example.com', user: 'kamol', tel: '0845678901' },
      { first: 'ปิยบุตร', last: 'แสงธรรม', email: 'piyabutr@example.com', user: 'piyabutr', tel: '0856789012' }
    ];

    const customers: any[] = [];
    for (const c of customerNames) {
      const savedCust = await this.prisma.user.create({
        data: {
          user_name: c.first,
          user_lastname: c.last,
          email: c.email,
          tel: c.tel,
          user_role: UserRole.USER,
          user_birth: new Date('1994-06-20'),
          auth: {
            create: {
              username: c.user,
              password: hashedPassword,
            },
          },
        },
      });
      customers.push(savedCust);
    }

    // 3. Seed AddressOptions & Addresses
    console.log('[Prisma Seeder] Seeding rich shipping addresses...');
    const provinceDetails = [
      { number: '12/4', road: 'มาลัยแมน', sub: 'นครปฐม', dist: 'เมืองนครปฐม', prov: 'นครปฐม', zip: 73000, label: 'บ้านคุณแม่' },
      { number: '85/10', road: 'พญาไท', sub: 'พญาไท', dist: 'ราชเทวี', prov: 'กรุงเทพมหานคร', zip: 10400, label: 'ที่ทำงาน' }
    ];

    const addresses: any[] = [];
    for (const cust of customers) {
      for (const p of provinceDetails) {
        const option = await this.prisma.addressOption.create({
          data: {
            ao_name: p.label,
            user_id: cust.id,
          },
        });

        const address = await this.prisma.address.create({
          data: {
            ao_id: option.id,
            number: p.number,
            road: p.road,
            subdistrict: p.sub,
            district: p.dist,
            province: p.prov,
            code_zip: p.zip,
            address_detail: p.label === 'ที่ทำงาน' ? 'ชั้น 12 ตึกใบหยก' : 'ตรงข้ามเซเว่นใหญ่',
            recipient_name: `${cust.user_name} ${cust.user_lastname}`,
            phone: cust.tel,
          },
        });
        addresses.push(address);
      }
    }

    // 4. Seed Mockup Orders, Items & Payments across 5 months (Jan-May 2026)
    console.log('[Prisma Seeder] Generating 45 historical analytics orders...');

    // Configurations of orders per month to establish a beautiful dynamic business growth chart
    // Jan: 6 orders, Feb: 8 orders, Mar: 10 orders, Apr: 11 orders, May: 10 orders
    const monthlyConfigs = [
      { month: 0, count: 6, year: 2026 },
      { month: 1, count: 8, year: 2026 },
      { month: 2, count: 10, year: 2026 },
      { month: 3, count: 11, year: 2026 },
      { month: 4, count: 10, year: 2026 }
    ];

    const paymentMethods = [PaymentStatus.MOBILE_BANKING, PaymentStatus.CREDIT_CARD, PaymentStatus.ONLY_CASE];

    for (const config of monthlyConfigs) {
      for (let i = 0; i < config.count; i++) {
        // Distribute order dates across the month
        const day = Math.floor(Math.random() * 27) + 1;
        const hour = Math.floor(Math.random() * 12) + 8; // 08:00 to 20:00
        const orderDate = new Date(config.year, config.month, day, hour, 0, 0);

        // Select random customer & their address
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
        const customerAddresses = addresses.filter(a => {
          return a.phone === randomCustomer.tel; // Match by phone
        });
        const randomAddress = customerAddresses.length > 0 
          ? customerAddresses[Math.floor(Math.random() * customerAddresses.length)]
          : addresses[0];

        // Status mix: 
        // Earlier months: 100% delivered / completed
        // Current month (May): mix of pending, preparing, shipping, delivered, canceled
        let status: OrderStatus = OrderStatus.DELIVERED;
        if (config.month === 4) {
          const randVal = Math.random();
          if (randVal < 0.2) status = OrderStatus.PENDING;
          else if (randVal < 0.4) status = OrderStatus.PREPARING;
          else if (randVal < 0.6) status = OrderStatus.SHIPPING;
          else if (randVal < 0.9) status = OrderStatus.DELIVERED;
          else status = OrderStatus.CANCELED;
        }

        // Random comment rating for delivered orders
        const starRating = status === OrderStatus.DELIVERED ? (Math.floor(Math.random() * 3) + 3) : null; // 3 to 5 stars

        // 1-3 random items per order
        const numItems = Math.floor(Math.random() * 3) + 1;
        const orderItems: any[] = [];
        let totalPriceSum = 0;

        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
        const selectedProducts = shuffledProducts.slice(0, numItems);

        selectedProducts.forEach(prod => {
          const qty = Math.floor(Math.random() * 2) + 1;
          const itemPrice = parseFloat(prod.product_price.toString());
          const totalItemPrice = itemPrice * qty;
          totalPriceSum += totalItemPrice;
          
          orderItems.push({
            product_id: prod.id,
            quantity: qty,
            price: itemPrice,
            total_price: totalItemPrice,
          });
        });

        // Create transaction Payment record
        const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const paymentRecord = await this.prisma.payment.create({
          data: { payment_name: randomMethod, created_at: orderDate },
        });

        // Create Order
        await this.prisma.order.create({
          data: {
            user_id: randomCustomer.id,
            status: status,
            orderdatetime: orderDate,
            payment_id: paymentRecord.id,
            address_id: randomAddress.id,
            total_price: totalPriceSum,
            comemnt_star: starRating,
            created_at: orderDate,
            updated_at: orderDate,
            order_items: {
              create: orderItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                total_price: item.total_price,
              })),
            },
          },
        });
      }
    }
  }
}


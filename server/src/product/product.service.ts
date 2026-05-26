import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, ProductStatus } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.productRepository.count();
      if (count === 0) {
        console.log('[Seeder] No products found. Seeding Thai mockup products...');
        const mockProducts = [
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
        await this.productRepository.save(this.productRepository.create(mockProducts));
        console.log('[Seeder] Successfully seeded Thai mockup products!');
      }
    } catch (e) {
      console.warn('[Seeder] Could not seed database, tables might not be ready yet:', e.message);
    }
  }

  async create(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);
    const savedProduct = await this.productRepository.save(product);
    return { data: savedProduct }; 
  }

  async findAll() {
    const products = await this.productRepository.find();
    return { data: products };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return { data: product };
  }

  async update(id: number, dto: UpdateProductDto) {
    const { data: product } = await this.findOne(id);
    Object.assign(product, dto);
    const updated = await this.productRepository.save(product);
    return { data: updated };
  }

  async remove(id: number) {
    const { data: product } = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: `Product #${id} deleted successfully` };
  }
}

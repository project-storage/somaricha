import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

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

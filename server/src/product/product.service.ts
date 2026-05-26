import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const savedProduct = await this.prisma.product.create({
      data: {
        product_name: dto.product_name,
        product_detail: dto.product_detail,
        product_price: dto.product_price,
        product_image: dto.product_image,
        product_status: dto.product_status as any as ProductStatus,
      },
    });
    return { data: savedProduct }; 
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    return { data: products };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return { data: product };
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        product_name: dto.product_name,
        product_detail: dto.product_detail,
        product_price: dto.product_price,
        product_image: dto.product_image,
        product_status: dto.product_status as any as ProductStatus,
      },
    });
    return { data: updated };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: `Product #${id} deleted successfully` };
  }
}

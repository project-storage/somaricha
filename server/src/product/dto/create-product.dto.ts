import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export enum ProductStatus {
  IN_STOCK = 'in stock',
  OUT_STOCK = 'out stock',
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Mouse',
  })
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'A high-precision wireless mouse with ergonomic design.',
  })
  @IsString()
  @IsNotEmpty()
  product_detail: string;

  @ApiProperty({
    description: 'Product price (must be greater than or equal to 0)',
    example: 29.99,
  })
  @IsNumber()
  @Min(0)
  product_price: number;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/images/mouse.jpg',
  })
  @IsUrl()
  product_image: string;

  @ApiProperty({
    description: 'Product status (in stock / out stock)',
    enum: ProductStatus,
    example: ProductStatus.IN_STOCK,
  })
  @IsEnum(ProductStatus)
  product_status: ProductStatus;
}

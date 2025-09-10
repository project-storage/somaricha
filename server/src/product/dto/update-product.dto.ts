import { PartialType, ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { ProductStatus } from './create-product.dto';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Mouse',
    required: false,
  })
  @IsString()
  @IsOptional()
  product_name?: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'A high-precision wireless mouse with ergonomic design.',
    required: false,
  })
  @IsString()
  @IsOptional()
  product_detail?: string;

  @ApiProperty({
    description: 'Product price',
    example: 29.99,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  product_price?: number;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/images/mouse.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  product_image?: string;

  @ApiProperty({
    description: 'Product status',
    enum: ProductStatus,
    example: ProductStatus.IN_STOCK,
    required: false,
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  product_status?: ProductStatus;
}

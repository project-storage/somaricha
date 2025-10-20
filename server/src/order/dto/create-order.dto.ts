import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsDate, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

class OrderItemDto {
  @ApiProperty({ description: 'ID of the product', example: 1 })
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({ description: 'Quantity of product', example: 2 })
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Price of the product', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID of the user', example: 1 })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ description: 'Status of the order', enum: OrderStatus, example: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ description: 'Date and time of order', example: '2025-09-10T12:00:00Z' })
  @IsDate()
  orderdatetime: Date;

  @ApiProperty({ description: 'Payment ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  payment_id: number;

  @ApiProperty({ description: 'Total price of the order', example: 1500 })
  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @ApiProperty({ description: 'Address ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  address_id: number;

  @ApiProperty({ description: 'Comment star rating (1-5)', example: 5, required: false })
  @IsInt()
  @IsOptional()
  comemnt_star?: number;

  @ApiProperty({ type: [OrderItemDto], description: 'Items in the order' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsArray()
  @IsNotEmpty()
  items: OrderItemDto[];
}
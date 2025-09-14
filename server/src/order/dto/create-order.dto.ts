import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsDate } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID of the product', example: 1 })
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({ description: 'ID of the user', example: 1 })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ description: 'Quantity of product', example: 2 })
  @IsInt()
  @IsNotEmpty()
  qty: number;

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

  @ApiProperty({ description: 'Address option ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  address_option: number;

  @ApiProperty({ description: 'Comment star rating (1-5)', example: 5, required: false })
  @IsInt()
  @IsOptional()
  comemnt_star?: number;
}

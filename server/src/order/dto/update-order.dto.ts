import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateOrderDto, OrderStatus } from './create-order.dto';
import { IsInt, IsNumber, IsOptional, IsEnum, IsDate } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ description: 'ID of the product', example: 1, required: false })
  @IsInt()
  @IsOptional()
  product_id?: number;

  @ApiProperty({ description: 'ID of the user', example: 1, required: false })
  @IsInt()
  @IsOptional()
  user_id?: number;

  @ApiProperty({ description: 'Quantity of product', example: 2, required: false })
  @IsInt()
  @IsOptional()
  qty?: number;

  @ApiProperty({ description: 'Status of the order', enum: OrderStatus, example: OrderStatus.PENDING, required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ description: 'Date and time of order', example: '2025-09-10T12:00:00Z', required: false })
  @IsDate()
  @IsOptional()
  orderdatetime?: Date;

  @ApiProperty({ description: 'Payment ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  payment_id?: number;

  @ApiProperty({ description: 'Total price of the order', example: 1500, required: false })
  @IsNumber()
  @IsOptional()
  total_price?: number;

  @ApiProperty({ description: 'Address option ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  address_option?: number;

  @ApiProperty({ description: 'Comment star rating (1-5)', example: 5, required: false })
  @IsInt()
  @IsOptional()
  comemnt_star?: number;
}

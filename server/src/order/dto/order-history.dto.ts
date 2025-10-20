import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

export class OrderHistoryItemDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Product name', example: 'iPhone 14' })
  product_name: string;

  @ApiProperty({ description: 'Product image URL', example: 'https://example.com/image.jpg' })
  product_image: string;

  @ApiProperty({ description: 'Order quantity', example: 2 })
  qty: number;

  @ApiProperty({ description: 'Total price', example: 1500.00 })
  total_price: number;

  @ApiProperty({ description: 'Order status', enum: OrderStatus, example: OrderStatus.SHIPPING })
  status: OrderStatus;

  @ApiProperty({ description: 'Order date and time', example: '2025-09-10T12:00:00Z' })
  orderdatetime: Date;

  @ApiProperty({ description: 'Order completion date and time', example: '2025-09-12T15:30:00Z', required: false })
  completed_at?: Date;

  @ApiProperty({ description: 'Comment star rating (1-5)', example: 5, required: false })
  comemnt_star?: number;
}

export class OrderHistoryResponseDto {
  @ApiProperty({ type: [OrderHistoryItemDto] })
  data: OrderHistoryItemDto[];
}
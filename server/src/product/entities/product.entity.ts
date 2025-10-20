import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductStatus } from '../dto/create-product.dto';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  product_name: string;

  @Column({ type: 'text' })
  product_detail: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  product_price: number;

  @Column({ type: 'varchar', length: 500 })
  product_image: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.IN_STOCK,
  })
  product_status: ProductStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  order_items: OrderItem[];
}

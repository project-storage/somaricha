import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../dto/create-user.dto';
import { Auth } from '../../auth/entities/auth.entity';
import { AddressOption } from 'src/address_option/entities/address_option.entity';
import { Order } from 'src/order/entities/order.entity';

export { UserRole }; // Export UserRole so it can be imported elsewhere

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  user_name: string;

  @Column({ type: 'varchar', length: 100 })
  user_lastname: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  user_imageUrl?: string;

  @Column({ type: 'date', nullable: true })
  user_birth: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  user_role: UserRole;

  @Column({ type: 'varchar', length: 20, nullable: true })
  tel: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToOne(() => Auth, (auth) => auth.user, { cascade: true, eager: true })
  auth: Auth;

  @OneToMany(() => AddressOption, (addressOption) => addressOption.user, {
    cascade: true,
  })
  addressOptions: AddressOption[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

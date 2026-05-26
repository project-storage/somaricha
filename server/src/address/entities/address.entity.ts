import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AddressOption } from './../../address_option/entities/address_option.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AddressOption, option => option.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ao_id' })
  addressOption: AddressOption;

  @Column({ type: 'varchar', length: 50 })
  number: string;

  @Column({ type: 'varchar', length: 255 })
  road: string;

  @Column({ type: 'varchar', length: 255 })
  subdistrict: string;

  @Column({ type: 'varchar', length: 255 })
  district: string;

  @Column({ type: 'varchar', length: 255 })
  province: string;

  @Column({ type: 'int' })
  code_zip: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address_detail?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipient_name?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum PaymentStatus {
  ONLY_CASE = 'only case',
  CREDIT_CARD = 'credit card',
  MOBILE_BANKING = 'mobile banking',
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Payment method',
    enum: PaymentStatus,
    example: PaymentStatus.CREDIT_CARD,
  })
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  payment_name: PaymentStatus;
}

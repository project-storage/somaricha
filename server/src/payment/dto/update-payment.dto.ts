import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto, PaymentStatus } from './create-payment.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({
    description: 'Payment method',
    enum: PaymentStatus,
    example: PaymentStatus.CREDIT_CARD,
    required: false, 
  })
  @IsEnum(PaymentStatus)
  @IsOptional() 
  payment_name?: PaymentStatus;
}

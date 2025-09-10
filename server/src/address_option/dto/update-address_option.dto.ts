import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAddressOptionDto } from './create-address_option.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAddressOptionDto extends PartialType(CreateAddressOptionDto) {
  @ApiProperty({ description: 'ID of the user', example: 1, required: false })
  @IsInt()
  @IsOptional()
  user_id?: number;

  @ApiProperty({ description: 'Name of the address option', example: 'Home', maxLength: 255, required: false })
  @IsString()
  @IsOptional()
  ao_name?: string;
}

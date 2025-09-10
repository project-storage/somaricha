import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';
import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty({ description: 'ID of the address option', example: 1, required: false })
  @IsInt()
  @IsOptional()
  ao_id?: number;

  @ApiProperty({ description: 'House/building number', example: '123/45', required: false })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({ description: 'Road name', example: 'Sukhumvit Rd', required: false })
  @IsString()
  @IsOptional()
  road?: string;

  @ApiProperty({ description: 'Subdistrict', example: 'Khlong Toei', required: false })
  @IsString()
  @IsOptional()
  subdistrict?: string;

  @ApiProperty({ description: 'District', example: 'Khlong Toei', required: false })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({ description: 'Province', example: 'Bangkok', required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ description: 'Postal code', example: 10110, required: false })
  @IsNumber()
  @IsOptional()
  code_zip?: number;

  @ApiProperty({ description: 'Additional address detail', example: 'Near BTS Station', required: false })
  @IsString()
  @IsOptional()
  address_detail?: string;
}

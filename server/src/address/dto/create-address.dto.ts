import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'ID of the address option', example: '1' })
  @IsString()
  @IsNotEmpty()
  ao_id: number;

  @ApiProperty({ description: 'House/building number', example: '123/45' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ description: 'Road name', example: 'Sukhumvit Rd' })
  @IsString()
  @IsNotEmpty()
  road: string;

  @ApiProperty({ description: 'Subdistrict', example: 'Khlong Toei' })
  @IsString()
  @IsNotEmpty()
  subdistrict: string;

  @ApiProperty({ description: 'District', example: 'Khlong Toei' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ description: 'Province', example: 'Bangkok' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ description: 'Postal code', example: 10110 })
  @IsNumber()
  @IsNotEmpty()
  code_zip: number;

  @ApiProperty({ description: 'Additional address detail', example: 'Near BTS Station', required: false })
  @IsString()
  @IsOptional()
  address_detail?: string;
}

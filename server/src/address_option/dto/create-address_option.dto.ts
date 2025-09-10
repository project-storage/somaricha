import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressOptionDto {
  @ApiProperty({ description: 'ID of the user', example: 1 })
  @IsInt()
  user_id: number;

  @ApiProperty({ description: 'Name of the address option', example: 'Home', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  ao_name: string;
}

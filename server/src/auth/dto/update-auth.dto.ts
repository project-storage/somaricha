import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import { IsInt, IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @ApiProperty({ description: 'ID of the user', example: 1, required: false })
  @IsInt()
  @IsOptional()
  user_id?: number;

  @ApiProperty({ description: 'Username for login', example: 'john_doe', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'Password for login', example: 'secret123', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Last login time', example: '2025-09-10T12:00:00Z', required: false })
  @IsDate()
  @IsOptional()
  last_login?: Date;
}

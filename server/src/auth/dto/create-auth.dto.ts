import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ description: 'ID of the user', example: 1 })
  @IsInt()
  user_id: number;

  @ApiProperty({ description: 'Username for login', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password for login', example: 'secret123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Last login time', example: '2025-09-10T12:00:00Z', required: false })
  @IsDate()
  @IsOptional()
  last_login?: Date;
}

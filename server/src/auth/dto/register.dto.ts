import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  user_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  user_lastname: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}

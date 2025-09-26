import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Unique } from 'typeorm';

export enum UserRole {
  OWER = 'OWER',
  USER = 'user',
}

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  user_lastname: string;

  @ApiProperty({ description: 'URL of user profile image', example: 'https://example.com/user.jpg' })
  @IsString()
  @IsOptional()
  user_imageUrl?: string;

  @ApiProperty({ description: 'User birth date', example: '1990-01-01' })
  @IsDate()
  user_birth: Date;

  @ApiProperty({ description: 'Role of the user', enum: UserRole, example: UserRole.USER })
  @IsEnum(UserRole)
  user_role: UserRole;

  @ApiProperty({ description: 'User phone number', example: '+66812345678' })
  @IsString()
  @Matches(/^\+?\d{8,15}$/, { message: 'Invalid phone number' })
  tel: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;
}

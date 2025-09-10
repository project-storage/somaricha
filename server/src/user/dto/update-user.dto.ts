import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto, UserRole } from './create-user.dto';
import { IsOptional, IsString, IsDate, IsEnum, IsEmail, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'First name of the user', example: 'John', required: false })
  @IsString()
  @IsOptional()
  user_name?: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  user_lastname?: string;

  @ApiProperty({ description: 'URL of user profile image', example: 'https://example.com/user.jpg', required: false })
  @IsString()
  @IsOptional()
  user_imageUrl?: string;

  @ApiProperty({ description: 'User birth date', example: '1990-01-01', required: false })
  @IsDate()
  @IsOptional()
  user_birth?: Date;

  @ApiProperty({ description: 'Role of the user', enum: UserRole, example: UserRole.USER, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  user_role?: UserRole;

  @ApiProperty({ description: 'User phone number', example: '+66812345678', required: false })
  @IsString()
  @Matches(/^\+?\d{8,15}$/, { message: 'Invalid phone number' })
  @IsOptional()
  tel?: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}

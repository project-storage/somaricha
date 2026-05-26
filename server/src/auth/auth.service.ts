import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existUsername = await this.prisma.auth.findUnique({
      where: { username: dto.username },
    });
    if (existUsername) throw new BadRequestException('Username already exists');

    const existEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existEmail) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.create({
      data: {
        user_name: dto.user_name,
        user_lastname: dto.user_lastname,
        email: dto.email,
        tel: dto.tel,
        user_role: UserRole.USER,
        auth: {
          create: {
            username: dto.username,
            password: hashedPassword,
          },
        },
      },
    });

    return { message: 'User registered successfully' };
  }

  async registerOwner(dto: RegisterDto) {
    const existUsername = await this.prisma.auth.findUnique({
      where: { username: dto.username },
    });
    if (existUsername) throw new BadRequestException('Username already exists');

    const existEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existEmail) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.create({
      data: {
        user_name: dto.user_name,
        user_lastname: dto.user_lastname,
        email: dto.email,
        tel: dto.tel,
        user_role: UserRole.OWNER,
        auth: {
          create: {
            username: dto.username,
            password: hashedPassword,
          },
        },
      },
    });

    return { message: 'Owner registered successfully' };
  }

  async login(dto: LoginDto) {
    const auth = await this.prisma.auth.findUnique({
      where: { username: dto.username },
      include: { user: true },
    });

    if (!auth) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, auth.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Update last login
    await this.prisma.auth.update({
      where: { id: auth.id },
      data: { last_login: new Date() },
    });

    const payload = {
      sub: auth.user.id,
      username: auth.username,
      role: auth.user.user_role,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      data: {
        access_token: token,
        user_role: auth.user.user_role,
        user: auth.user,
      },
    };
  }
}

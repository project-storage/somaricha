import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existUsername = await this.authRepo.findOne({
      where: { username: dto.username },
    });
    if (existUsername) throw new BadRequestException('Username already exists');

    const existEmail = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existEmail) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      user_name: dto.user_name,
      user_lastname: dto.user_lastname,
      email: dto.email,
      user_role: UserRole.USER,
    });
    await this.userRepo.save(user);

    const auth = this.authRepo.create({
      username: dto.username,
      password: hashedPassword,
      user,
    });
    await this.authRepo.save(auth);

    return { message: 'User registered successfully' };
  }

  async registerOwer(dto: RegisterDto) {
    const existUsername = await this.authRepo.findOne({
      where: { username: dto.username },
    });
    if (existUsername) throw new BadRequestException('Username already exists');

    const existEmail = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existEmail) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      user_name: dto.user_name,
      user_lastname: dto.user_lastname,
      email: dto.email,
      user_role: UserRole.OWER,
    });
    await this.userRepo.save(user);

    const auth = this.authRepo.create({
      username: dto.username,
      password: hashedPassword,
      user,
    });
    await this.authRepo.save(auth);

    return { message: 'Ower registered successfully' };
  }

  async login(dto: LoginDto) {
    const auth = await this.authRepo.findOne({
      where: { username: dto.username },
      relations: ['user'],
    });

    if (!auth) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, auth.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: auth.user.id,
      username: auth.username,
      role: auth.user.user_role,
    };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token, user: auth.user };
  }
}

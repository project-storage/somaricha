import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepo.find();
    return { data: users };
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return { data: user };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    Object.assign(user, updateUserDto);
    const updated = await this.userRepo.save(user);
    return { data: updated };
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    await this.userRepo.remove(user);
    return { data: { message: `User #${id} deleted successfully` } };
  }

  async getUserInfo(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['auth', 'addressOptions', 'orders'],
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return { data: user };
  }
}

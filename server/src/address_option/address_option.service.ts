import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressOption } from './entities/address_option.entity';
import { CreateAddressOptionDto } from './dto/create-address_option.dto';
import { UpdateAddressOptionDto } from './dto/update-address_option.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AddressOptionService {
  constructor(
    @InjectRepository(AddressOption)
    private readonly addressOptionRepo: Repository<AddressOption>,
  ) {}

  async create(user: User, dto: CreateAddressOptionDto) {
    const option = this.addressOptionRepo.create({
      ao_name: dto.ao_name,
      user,
    });
    return await this.addressOptionRepo.save(option);
  }

  async findAll(user: User) {
    return await this.addressOptionRepo.find({
      where: { user: { id: user.id } },
      relations: ['addresses'],
    });
  }

  async findOne(id: number, user: User) {
    const option = await this.addressOptionRepo.findOne({
      where: { id, user: { id: user.id } },
      relations: ['addresses'],
    });
    if (!option) throw new NotFoundException(`AddressOption #${id} not found`);
    return option;
  }

  async update(id: number, dto: UpdateAddressOptionDto, user: User) {
    const option = await this.findOne(id, user);
    option.ao_name = dto.ao_name ?? option.ao_name;
    return await this.addressOptionRepo.save(option);
  }

  async remove(id: number, user: User) {
    const option = await this.findOne(id, user);
    await this.addressOptionRepo.remove(option);
    return { message: `AddressOption #${id} deleted successfully` };
  }
}

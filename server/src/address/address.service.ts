import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressOption } from 'src/address_option/entities/address_option.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    @InjectRepository(AddressOption)
    private readonly addressOptionRepo: Repository<AddressOption>,
  ) {}

  async create(user: User, dto: CreateAddressDto) {
    const option = await this.addressOptionRepo.findOne({
      where: { id: dto.ao_id, user: { id: user.id } },
    });
    if (!option) throw new NotFoundException(`AddressOption #${dto.ao_id} not found`);

    const address = this.addressRepo.create({
      ...dto,
      addressOption: option,
    });
    return await this.addressRepo.save(address);
  }

  async findAll(user: User) {
    return await this.addressRepo.find({
      where: { addressOption: { user: { id: user.id } } },
      relations: ['addressOption'],
    });
  }

  async findOne(id: number, user: User) {
    const address = await this.addressRepo.findOne({
      where: { id, addressOption: { user: { id: user.id } } },
      relations: ['addressOption'],
    });
    if (!address) throw new NotFoundException(`Address #${id} not found`);
    return address;
  }

  async update(id: number, dto: UpdateAddressDto, user: User) {
    const address = await this.findOne(id, user);
    Object.assign(address, dto);
    return await this.addressRepo.save(address);
  }

  async remove(id: number, user: User) {
    const address = await this.findOne(id, user);
    await this.addressRepo.remove(address);
    return { message: `Address #${id} deleted successfully` };
  }
}

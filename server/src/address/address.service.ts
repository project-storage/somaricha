import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: { id: number }, dto: CreateAddressDto) {
    const option = await this.prisma.addressOption.findFirst({
      where: { id: dto.ao_id, user_id: user.id },
    });
    if (!option) throw new NotFoundException(`AddressOption #${dto.ao_id} not found`);

    const saved = await this.prisma.address.create({
      data: {
        ao_id: dto.ao_id,
        number: dto.number,
        road: dto.road,
        subdistrict: dto.subdistrict,
        district: dto.district,
        province: dto.province,
        code_zip: dto.code_zip,
        address_detail: dto.address_detail,
      },
    });
    return { data: saved };
  }

  async findAll(user: { id: number }) {
    const addresses = await this.prisma.address.findMany({
      where: { addressOption: { user_id: user.id } },
      include: { addressOption: true },
    });
    return { data: addresses };
  }

  async findOne(id: number, user: { id: number }) {
    const address = await this.prisma.address.findFirst({
      where: { id, addressOption: { user_id: user.id } },
      include: { addressOption: true },
    });
    if (!address) throw new NotFoundException(`Address #${id} not found`);
    return { data: address };
  }

  async update(id: number, dto: UpdateAddressDto, user: { id: number }) {
    await this.findOne(id, user);
    const updated = await this.prisma.address.update({
      where: { id },
      data: {
        number: dto.number,
        road: dto.road,
        subdistrict: dto.subdistrict,
        district: dto.district,
        province: dto.province,
        code_zip: dto.code_zip,
        address_detail: dto.address_detail,
      },
    });
    return { data: updated };
  }

  async remove(id: number, user: { id: number }) {
    await this.findOne(id, user);
    await this.prisma.address.delete({ where: { id } });
    return { data: { message: `Address #${id} deleted successfully` } };
  }
}

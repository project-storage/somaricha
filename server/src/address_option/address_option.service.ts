import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressOptionDto } from './dto/create-address_option.dto';
import { UpdateAddressOptionDto } from './dto/update-address_option.dto';

@Injectable()
export class AddressOptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: { id: number }, dto: CreateAddressOptionDto) {
    const saved = await this.prisma.addressOption.create({
      data: {
        ao_name: dto.ao_name,
        user_id: user.id,
      },
    });
    return { data: saved };
  }

  async findAll(user: { id: number }) {
    const options = await this.prisma.addressOption.findMany({
      where: { user_id: user.id },
      include: { addresses: true },
    });
    return { data: options };
  }

  async findOne(id: number, user: { id: number }) {
    const option = await this.prisma.addressOption.findFirst({
      where: { id, user_id: user.id },
      include: { addresses: true },
    });
    if (!option) throw new NotFoundException(`AddressOption #${id} not found`);
    return { data: option };
  }

  async update(id: number, dto: UpdateAddressOptionDto, user: { id: number }) {
    await this.findOne(id, user);
    const updated = await this.prisma.addressOption.update({
      where: { id },
      data: {
        ao_name: dto.ao_name,
      },
    });
    return { data: updated };
  }

  async remove(id: number, user: { id: number }) {
    await this.findOne(id, user);
    await this.prisma.addressOption.delete({ where: { id } });
    return { data: { message: `AddressOption #${id} deleted successfully` } };
  }
}

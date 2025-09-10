import { Injectable } from '@nestjs/common';
import { CreateAddressOptionDto } from './dto/create-address_option.dto';
import { UpdateAddressOptionDto } from './dto/update-address_option.dto';

@Injectable()
export class AddressOptionService {
  create(createAddressOptionDto: CreateAddressOptionDto) {
    return 'This action adds a new addressOption';
  }

  findAll() {
    return `This action returns all addressOption`;
  }

  findOne(id: number) {
    return `This action returns a #${id} addressOption`;
  }

  update(id: number, updateAddressOptionDto: UpdateAddressOptionDto) {
    return `This action updates a #${id} addressOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} addressOption`;
  }
}

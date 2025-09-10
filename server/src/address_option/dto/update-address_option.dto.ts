import { PartialType } from '@nestjs/swagger';
import { CreateAddressOptionDto } from './create-address_option.dto';

export class UpdateAddressOptionDto extends PartialType(CreateAddressOptionDto) {}

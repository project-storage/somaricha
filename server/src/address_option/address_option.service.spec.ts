import { Test, TestingModule } from '@nestjs/testing';
import { AddressOptionService } from './address_option.service';

describe('AddressOptionService', () => {
  let service: AddressOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressOptionService],
    }).compile();

    service = module.get<AddressOptionService>(AddressOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

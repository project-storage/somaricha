import { Test, TestingModule } from '@nestjs/testing';
import { AddressOptionController } from './address_option.controller';
import { AddressOptionService } from './address_option.service';

describe('AddressOptionController', () => {
  let controller: AddressOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressOptionController],
      providers: [AddressOptionService],
    }).compile();

    controller = module.get<AddressOptionController>(AddressOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

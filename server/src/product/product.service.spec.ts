import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductStatus } from './dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: any;

  const mockProduct = {
    id: 1,
    product_name: 'Somari Peach Tea',
    product_detail: 'Authentic healthy fruit tea',
    product_price: 60,
    product_image: 'peach_tea.jpg',
    product_status: ProductStatus.IN_STOCK,
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((product) =>
        Promise.resolve({ id: 1, ...product }),
      ),
      find: jest.fn().mockResolvedValue([mockProduct]),
      findOne: jest.fn().mockImplementation(({ where: { id } }) => {
        if (id === 1) return Promise.resolve(mockProduct);
        return Promise.resolve(null);
      }),
      remove: jest.fn().mockResolvedValue(mockProduct),
      count: jest.fn().mockResolvedValue(5),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create and return a product', async () => {
      const dto = {
        product_name: 'Somari Peach Tea',
        product_detail: 'Authentic healthy fruit tea',
        product_price: 60,
        product_image: 'peach_tea.jpg',
        product_status: ProductStatus.IN_STOCK,
      };

      const result = await service.create(dto);
      expect(result).toEqual({ data: { id: 1, ...dto } });
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all products inside the standard envelope', async () => {
      const result = await service.findAll();
      expect(result).toEqual({ data: [mockProduct] });
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should successfully return a product if found', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual({ data: mockProduct });
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a NotFoundException if product is not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should successfully update and return the product', async () => {
      const dto = { product_price: 65 };
      const result = await service.update(1, dto);
      expect(result.data.product_price).toBe(65);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully remove the product and return success message', async () => {
      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Product #1 deleted successfully' });
      expect(mockRepository.remove).toHaveBeenCalled();
    });
  });
});

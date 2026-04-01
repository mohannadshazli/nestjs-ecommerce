import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { LocalStorage } from 'src/common/upload/storage/local.storage';
import { UploadType } from 'src/common/upload/enums/upload-type.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private storage: LocalStorage,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files?: {
      productImageUrl?: Express.Multer.File[];
      productImagesUrls?: Express.Multer.File[];
    },
  ) {
    if (files && Object.keys(files).length > 0) {
      const urls = await this.storage.upload(files, UploadType.PRODUCT);
      createProductDto.productImageUrl = urls.fileUrl;
      createProductDto.productImagesUrls = urls.filesUrls;
    }
    return this.productModel.create(createProductDto);
  }

  async uploadProductImage(
    id: string,
    files: {
      productImageUrl: Express.Multer.File[];
    },
  ) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const { fileUrl } = await this.storage.upload(files, UploadType.PRODUCT);
    product.productImageUrl = fileUrl;
    return product.save();
  }

  async uploadProductImages(
    id: string,
    files: {
      productImagesUrls: Express.Multer.File[];
    },
  ) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const { filesUrls } = await this.storage.upload(files, UploadType.PRODUCT);
    product.productImagesUrls = filesUrls;
    await product.save();
    return product;
  }

  async findAll() {
    return this.productModel.find();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  async removeProductImage(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.productImageUrl =
      'http://localhost:3000/uploads/products/default.jpeg';
    return product.save();
  }

  async removeProductImageFromProductImages(id: string, imageUrl: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.productImagesUrls = (product.productImagesUrls || []).filter(
      (url) => url !== imageUrl,
    );
    return product.save();
  }

  async remove(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productModel.findByIdAndDelete(id);
  }
}

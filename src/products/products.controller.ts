import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  UploadProductImageDto,
  UploadProductImagesDto,
} from './dto/upload-product-images.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'productImageUrl', maxCount: 1 },
      { name: 'productImagesUrls', maxCount: 5 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create product',
    type: CreateProductDto,
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files?: {
      productImageUrl?: Express.Multer.File[];
      productImagesUrls?: Express.Multer.File[];
    },
  ) {
    return this.productsService.create(createProductDto, files);
  }

  @Post(':id/upload-image')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'productImageUrl', maxCount: 1 }]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload or update product image',
    type: UploadProductImageDto,
  })
  uploadProductImage(
    @Param('id', ParseObjectIdPipe) id: string,
    @UploadedFiles()
    files: {
      productImageUrl: Express.Multer.File[];
    },
  ) {
    return this.productsService.uploadProductImage(id, files);
  }

  @Post(':id/upload-images')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'productImagesUrls', maxCount: 5 }]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload product images',
    type: UploadProductImagesDto,
  })
  uploadProductImages(
    @Param('id', ParseObjectIdPipe) id: string,
    @UploadedFiles()
    files: {
      productImagesUrls: Express.Multer.File[];
    },
  ) {
    return this.productsService.uploadProductImages(id, files);
  }

  @Patch(':id/update-product-images')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'productImagesUrls', maxCount: 5 }]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload product images',
    type: UploadProductImagesDto,
  })
  updateProductImages(
    @Param('id', ParseObjectIdPipe) id: string,
    @UploadedFiles()
    files: {
      productImagesUrls: Express.Multer.File[];
    },
  ) {
    return this.productsService.uploadProductImages(id, files);
  }

  @Delete(':id/delete-product-image')
  deleteProductImage(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.removeProductImage(id);
  }

  @Delete(':id/delete-image-from-product-images')
  @ApiBody({
    description: 'Delete image from product images',
    examples: {
      imageUrl: {
        value: {
          imageUrl: 'http://localhost:3000/uploads/products/image.jpg',
        },
      },
    },
  })
  deleteProductImages(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.productsService.removeProductImageFromProductImages(
      id,
      imageUrl,
    );
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.remove(id);
  }
}

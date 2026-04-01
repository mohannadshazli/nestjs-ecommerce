import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'PRODUCT_1' })
  @Length(2, 100)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Length(2, 500)
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 500 })
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 1000 })
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ example: 'CATEGORY_1' })
  @Length(2, 50)
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Product image (optional)',
  })
  productImageUrl?: string;

  @IsOptional()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
    description: 'Product images (optional)',
  })
  productImagesUrls?: string[];
}

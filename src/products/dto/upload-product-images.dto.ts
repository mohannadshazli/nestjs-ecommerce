import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadProductImageDto {
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product image (optional)',
  })
  productImageUrl: string;
}

export class UploadProductImagesDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    default: [],
    description: 'Product images',
  })
  productImagesUrls: string;
}

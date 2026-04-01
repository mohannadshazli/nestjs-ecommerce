import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadType } from './enums/upload-type.enum';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'type',
    enum: [
      UploadType.PRODUCT,
      UploadType.USER,
      UploadType.BRAND,
      UploadType.CATEGORY,
    ],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() files: { [key: string]: Express.Multer.File[] },
    @Query('type') type: UploadType,
  ) {
    if (!files) throw new BadRequestException('File is required');

    if (!Object.values(UploadType).includes(type)) {
      throw new BadRequestException('Invalid upload type');
    }

    return this.uploadService.upload(files, type);
  }
}

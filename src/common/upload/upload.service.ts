import { Injectable } from '@nestjs/common';
import { UploadType } from './enums/upload-type.enum';
import { LocalStorage } from './storage/local.storage';

@Injectable()
export class UploadService {
  constructor(private readonly storage: LocalStorage) {}
  async upload(
    files: { [key: string]: Express.Multer.File[] },
    type: UploadType,
  ) {
    const url = await this.storage.upload(files, type);
    return { url };
  }
}

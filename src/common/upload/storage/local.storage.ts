import { Injectable } from '@nestjs/common';
import { StorageProvider } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';
import { UploadType } from '../enums/upload-type.enum';
import { makeUrl } from '../utils/make-url';
import { IsImage } from '../utils/image-filter';

@Injectable()
export class LocalStorage implements StorageProvider {
  async upload(
    files: { [key: string]: Express.Multer.File[] },
    folder: UploadType,
  ): Promise<{
    fileUrl?: string;
    filesUrls?: string[];
  }> {
    const uploadPath = path.join(process.cwd(), 'uploads', folder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    const singleKey = Object.keys(files).find((key) => !key.endsWith('s'));
    const pluralKey = Object.keys(files).find((key) => key.endsWith('s'));
    let fileUrl: string | undefined;
    let filesUrls: string[] = [];
    if (singleKey) {
      IsImage(files[`${singleKey}`][0]);
      const file = files[`${singleKey}`][0];
      fileUrl = makeUrl(file, folder, uploadPath);
    }
    if (pluralKey) {
      for (const file of files[`${pluralKey}`]) {
        IsImage(file);
        filesUrls.push(makeUrl(file, folder, uploadPath));
      }
    }

    return {
      fileUrl,
      filesUrls,
    };
  }
}

import { BadRequestException } from '@nestjs/common';

export function IsImage(file: Express.Multer.File): boolean {
  const type = file.mimetype.split('/')[0];
  if (type !== 'image') {
    throw new BadRequestException('Invalid file type');
  }
  return true;
}

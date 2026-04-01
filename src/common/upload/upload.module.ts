import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { LocalStorage } from './storage/local.storage';

@Module({
  controllers: [UploadController],
  providers: [UploadService, LocalStorage],
  exports: [UploadService, LocalStorage],
})
export class UploadModule {}

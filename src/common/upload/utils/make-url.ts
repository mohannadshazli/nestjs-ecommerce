import { UploadType } from 'src/common/upload/enums/upload-type.enum';
import * as fs from 'fs';
import * as path from 'path';

export function makeUrl(
  file: Express.Multer.File,
  folder: UploadType,
  uploadPath: string,
): string {
  const ext = path.extname(file.originalname);
  const fileName = `${folder}-${Date.now()}${ext}`;
  const filePath = path.join(uploadPath, fileName);
  fs.writeFileSync(filePath, file.buffer);
  return `http://localhost:3000/uploads/${folder}/${fileName}`;
}

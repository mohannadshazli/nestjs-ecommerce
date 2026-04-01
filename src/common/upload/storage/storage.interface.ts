// storage.interface.ts
export interface StorageProvider {
  upload(
    files: {
      [key: string]: Express.Multer.File[] | undefined;
    },
    path: string,
  ): Promise<{}>;
}

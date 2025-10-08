// src/events/cloudinary-storage.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryStorageService {
  constructor() {}

  static createStorage(folder: string) {
    return new CloudinaryStorage({
      cloudinary: cloudinary, // Usa a instância configurada estaticamente
      params: async (_req: any, file: any) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          throw new BadRequestException(
            'Apenas arquivos de imagem são permitidos (jpg, jpeg, png, webp).',
          );
        }

        return {
          folder: `event_manager/${folder}`,
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        } as any;
      },
    });
  }
}

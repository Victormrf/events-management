import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 } from 'cloudinary';
import { CLOUDINARY } from '../cloudinary/constants';

@Injectable()
export class CloudinaryStorageService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof v2) {}
  createStorage(folder: string) {
    return new CloudinaryStorage({
      cloudinary: this.cloudinary,
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

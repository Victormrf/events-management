import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImageFromBase64(
    base64Data: string,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const fileStr = base64Data.startsWith('data:')
        ? base64Data
        : `data:image/png;base64,${base64Data}`;

      cloudinary.uploader.upload(
        fileStr,
        {
          folder: `event_manager/${folder}`,
          resource_type: 'image',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            console.error('Erro no upload Cloudinary (Base64):', error);
            return reject(
              new InternalServerErrorException(
                'Falha ao enviar imagem gerada por IA.',
              ),
            );
          }
          resolve(result);
        },
      );
    });
  }
}

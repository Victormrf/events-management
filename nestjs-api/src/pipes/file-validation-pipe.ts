import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Multer } from 'multer'; // Importação do tipo Multer File

/**
 * Pipe de validação customizado para garantir que um arquivo de imagem seja enviado
 * e que seu formato seja permitido (JPEG, PNG ou WEBP).
 */
@Injectable()
export class FileValidationPipe implements PipeTransform {
  // Define os formatos de imagem permitidos
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
  ];

  /**
   * Transforma e valida o objeto de arquivo.
   * @param value O arquivo recebido do Multer.
   * @returns O objeto de arquivo validado.
   */
  transform(value: any): Multer.File {
    const file = value as Multer.File;

    // 1. Verifica se o arquivo existe
    if (!file) {
      // Retorna null/undefined para permitir que o campo seja opcional
      return undefined;
    }

    // 2. Verifica o tipo MIME (formato do arquivo)
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato de arquivo inválido. Apenas JPG, PNG e WEBP são permitidos.',
      );
    }

    // 3. Define um limite máximo (opcional, mas recomendado para segurança)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        'O arquivo é muito grande. O tamanho máximo permitido é de 5MB.',
      );
    }

    return file;
  }
}

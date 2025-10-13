// src/pipes/json-parse.pipe.ts

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class JsonParsePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      // O Multer/Express coloca campos não-arquivo no req.body como strings.
      // Este pipe tenta converter strings que parecem JSON em objetos JS.
      try {
        if (typeof value === 'string') {
          return JSON.parse(value);
        }
        // Se o valor já for um objeto (ou undefined), o class-validator pode lidar com isso.
        return value;
      } catch (e) {
        // Se a string não for um JSON válido, lança um erro
        throw new BadRequestException(
          `Falha ao parsear JSON para o campo ${metadata.data}`,
        );
      }
    }
    return value;
  }
}

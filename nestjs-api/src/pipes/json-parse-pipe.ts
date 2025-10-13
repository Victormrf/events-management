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
      try {
        if (typeof value === 'string') {
          return JSON.parse(value);
        }
        return value;
      } catch (e) {
        throw new BadRequestException(
          `Falha ao parsear JSON para o campo ${metadata.data}: ${e.message}`,
        );
      }
    }
    return value;
  }
}

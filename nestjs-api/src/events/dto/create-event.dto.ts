import {
  IsDateString,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  location: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  maxAttendees?: number;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '2' },
    {
      message: 'Preço deve ser um número decimal com até duas casas decimais.',
    },
  )
  @Min(0, { message: 'Preço não pode ser negativo.' })
  price?: number;
}

import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'twoDecimals', async: false })
export class TwoDecimalsConstraint implements ValidatorConstraintInterface {
  validate(value: number) {
    return /^\d+(\.\d{1,2})?$/.test(value.toString());
  }
  defaultMessage() {
    return 'Preço deve ter no máximo duas casas decimais.';
  }
}

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
  @IsNumber({}, { message: 'Preço deve ser um número.' })
  @Min(0, { message: 'Preço não pode ser negativo.' })
  @Validate(TwoDecimalsConstraint)
  price?: number;
}

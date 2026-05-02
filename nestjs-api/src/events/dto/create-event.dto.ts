import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @ApiProperty({ description: 'The title of the event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the event' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The date and time of the event' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: 'The maximum number of attendees' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  maxAttendees?: number;

  @ApiPropertyOptional({ description: 'The price of the event' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'Preço deve ser um número.' })
  @Min(0, { message: 'Preço não pode ser negativo.' })
  @Validate(TwoDecimalsConstraint)
  price?: number;

  @ApiProperty({ description: 'The full address of the event' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ description: 'An optional image URL' })
  @IsOptional()
  @IsString()
  image?: string;
}

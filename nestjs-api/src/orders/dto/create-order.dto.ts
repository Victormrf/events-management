import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class AttendeeDetailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendeeDetailDto)
  attendees: AttendeeDetailDto[];
}

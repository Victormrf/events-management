import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
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
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendeeDetailDto)
  attendees: AttendeeDetailDto[];
}

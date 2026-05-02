import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'The name of the attendee' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'The email of the attendee' })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'The ID of the event to register for' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    description: 'List of attendees for the order',
    type: [AttendeeDetailDto],
  })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendeeDetailDto)
  attendees: AttendeeDetailDto[];
}

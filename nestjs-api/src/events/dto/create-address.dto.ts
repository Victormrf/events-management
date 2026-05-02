import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'The street address' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiPropertyOptional({ description: 'The neighborhood' })
  @IsString()
  @IsOptional()
  neighborhood?: string;

  @ApiProperty({ description: 'The city' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'The state' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'The country' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({ description: 'The zip code' })
  @IsString()
  @IsOptional()
  zipCode?: string;
}

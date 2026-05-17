import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TicketmasterEventDto {
  @ApiProperty({ description: 'The city to search for events in', example: 'New York' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'The state to search for events in', example: 'NY' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'The country to search for events in', example: 'US' })
  @IsString()
  @IsNotEmpty()
  country: string;
}
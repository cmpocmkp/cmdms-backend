import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty({
    description: 'Minute ID this reply belongs to',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  minuteId: number;

  @ApiProperty({
    description: 'Response/reply text',
    example: 'Action completed as per the directive',
  })
  @IsString()
  @IsNotEmpty()
  response: string;
}


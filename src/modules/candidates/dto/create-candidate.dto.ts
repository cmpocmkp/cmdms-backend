import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, IsEnum } from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({ description: 'Candidate name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'CNIC number', example: '12345-1234567-1' })
  @IsString()
  @IsOptional()
  cnic?: string;

  @ApiProperty({ description: 'Candidate type', enum: ['MNA', 'MPA'], example: 'MPA' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['MNA', 'MPA'])
  type: string;

  @ApiPropertyOptional({ description: 'Constituency ID', example: 1 })
  @IsInt()
  @IsOptional()
  constituencyId?: number;

  @ApiPropertyOptional({ description: 'Political party', example: 'PTI' })
  @IsString()
  @IsOptional()
  party?: string;

  @ApiPropertyOptional({ description: 'Contact number', example: '+92-300-1234567' })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
}


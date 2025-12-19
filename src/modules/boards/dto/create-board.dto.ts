import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({
    description: 'Board name',
    example: 'University Board of Governors',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Board description',
    example: 'Board responsible for university governance and policy decisions',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type of board',
    example: 'university',
    enum: ['university', 'hospital', 'corporate', 'regulatory', 'advisory', 'district'],
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['university', 'hospital', 'corporate', 'regulatory', 'advisory', 'district'])
  boardType: string;

  @ApiPropertyOptional({
    description: 'Parent department ID',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  parentDepartmentId?: number;

  @ApiPropertyOptional({
    description: 'Minimum quorum requirement for meetings',
    example: 5,
  })
  @IsInt()
  @IsOptional()
  quorumRequirement?: number;

  @ApiPropertyOptional({
    description: 'Meeting frequency',
    example: 'monthly',
    enum: ['monthly', 'quarterly', 'bi-annually', 'annually'],
  })
  @IsString()
  @IsOptional()
  @IsEnum(['monthly', 'quarterly', 'bi-annually', 'annually'])
  meetingFrequency?: string;
}


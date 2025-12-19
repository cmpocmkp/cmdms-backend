import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty({
    description: 'Complaint title/subject',
    example: 'Road maintenance issue',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed complaint description',
    example: 'The road in sector A is in poor condition and needs immediate repair',
  })
  @IsString()
  @IsNotEmpty()
  detail: string;

  @ApiProperty({
    description: 'Name of the complainant',
    example: 'Muhammad Ali',
  })
  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @ApiPropertyOptional({
    description: 'Contact information of the complainant',
    example: '+92-300-1234567',
  })
  @IsString()
  @IsOptional()
  applicantContact?: string;

  @ApiPropertyOptional({
    description: 'CNIC of the complainant',
    example: '12345-1234567-1',
  })
  @IsString()
  @IsOptional()
  applicantCnic?: string;

  @ApiPropertyOptional({
    description: 'Location where the issue occurred',
    example: 'Sector A, Main Road, Peshawar',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Department ID responsible for handling this complaint',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @ApiPropertyOptional({
    description: 'District ID where the complaint originated',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  districtId?: number;

  @ApiPropertyOptional({
    description: 'Diary/reference number for the complaint',
    example: 'CMP/2024/001',
  })
  @IsString()
  @IsOptional()
  diaryNumber?: string;

  @ApiProperty({
    description: 'Timeline for complaint resolution',
    example: '2024-02-15T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  timeline: string;

  @ApiPropertyOptional({
    description: 'Complaint priority level',
    example: 'high',
    enum: ['low', 'normal', 'high', 'urgent'],
  })
  @IsString()
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;
}


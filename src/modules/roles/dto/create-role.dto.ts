import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Project Manager',
    description: 'Role name',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'Manages project planning and execution',
    description: 'Role description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Is role active',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}


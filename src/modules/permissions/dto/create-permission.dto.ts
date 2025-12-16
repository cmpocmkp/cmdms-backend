import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'users.create',
    description: 'Unique permission name',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'Create Users',
    description: 'Display name for the permission',
  })
  @IsString()
  @MinLength(2)
  displayName: string;

  @ApiProperty({
    example: 'Allows creating new users',
    description: 'Permission description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'users',
    description: 'Module name',
    required: false,
  })
  @IsString()
  @IsOptional()
  module?: string;

  @ApiProperty({
    example: 'users',
    description: 'Permission category',
  })
  @IsString()
  category: string;
}


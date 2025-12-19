import { IsEmail, IsNotEmpty, IsString, IsOptional, IsInt, IsEnum, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from '../../../common/enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+923001234567',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role ID to assign to the user',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @ApiProperty({
    description: 'Department ID to assign to the user',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @ApiPropertyOptional({
    description: 'User group ID',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  userGroupId?: number;

  @ApiPropertyOptional({
    description: 'Manager ID',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  managerId?: number;

  @ApiPropertyOptional({
    description: 'User type',
    enum: UserType,
    example: UserType.REGULAR,
  })
  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @ApiPropertyOptional({
    description: 'Whether the user account is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the user must change password on first login',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  mustChangePassword?: boolean;
}


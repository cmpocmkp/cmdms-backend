import { IsEmail, IsNotEmpty, IsString, IsOptional, IsInt, IsEnum, IsBoolean, MinLength } from 'class-validator';
import { UserType } from '../../../common/enums';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @IsInt()
  @IsOptional()
  userGroupId?: number;

  @IsInt()
  @IsOptional()
  managerId?: number;

  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  mustChangePassword?: boolean;
}


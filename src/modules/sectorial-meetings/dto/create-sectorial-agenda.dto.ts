import { IsNotEmpty, IsString, IsOptional, IsInt, IsArray, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DecisionStatus } from '../../../common/enums';

export class CreateSectorialAgendaDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    decision?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    timeline?: string;

    @ApiProperty({ enum: DecisionStatus, default: DecisionStatus.ON_TARGET })
    @IsOptional()
    @IsEnum(DecisionStatus)
    status?: DecisionStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    comments?: string;

    @ApiProperty({ type: [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    departmentIds?: number[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    linkedSchemeId?: number;
}

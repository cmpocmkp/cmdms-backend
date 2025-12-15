import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateReplyDto {
  @IsInt()
  @IsNotEmpty()
  minuteId: number;

  @IsString()
  @IsNotEmpty()
  response: string;
}


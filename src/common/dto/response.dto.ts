import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Response data',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Additional metadata (pagination, etc.)',
  })
  metadata?: any;

  constructor(success: boolean, data?: T, message?: string, metadata?: any) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.metadata = metadata;
  }

  static success<T>(data?: T, message?: string, metadata?: any): ResponseDto<T> {
    return new ResponseDto(true, data, message, metadata);
  }

  static error<T>(message: string, data?: T): ResponseDto<T> {
    return new ResponseDto(false, data, message);
  }
}


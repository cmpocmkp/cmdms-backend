export class ResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T;
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


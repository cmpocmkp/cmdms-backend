import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'API Health Check and Information' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHello() {
    return {
      success: true,
      message: 'CMDMS Backend API is running',
      version: '1.0.0',
      documentation: '/api-docs',
      endpoints: {
        swagger: '/api-docs',
        api: '/api',
        health: '/',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

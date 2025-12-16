import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'API Health Check and Information' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHello() {
    return {
      success: true,
      message: 'CMDMS Backend API is running',
      version: '1.0.0',
      documentation: '/api/docs',
      endpoints: {
        swagger: '/api/docs',
        api: '/api',
        health: '/',
        login: '/api/auth/login',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

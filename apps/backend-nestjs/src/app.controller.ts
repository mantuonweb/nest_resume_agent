import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API root endpoint',
    description: 'Returns basic API information',
  })
  @ApiResponse({
    status: 200,
    description: 'API information',
    schema: {
      example: {
        message: 'Resume Management API',
        version: '4.0.0',
        docs: '/api',
      },
    },
  })
  getHello() {
    return {
      message: 'Resume Management API',
      version: '4.0.0',
      docs: '/api',
    };
  }
}

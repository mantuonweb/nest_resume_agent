import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { QueryDto } from './dto/query.dto';
import { QueryResponseDto } from './dto/query-response.dto';

@ApiTags('agent')
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('query')
  @ApiOperation({
    summary: 'Send a query to the AI agent',
    description:
      'The agent can manage resumes, search for candidates, and answer questions about the resume database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Query processed successfully',
    type: QueryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async query(@Body() queryDto: QueryDto): Promise<QueryResponseDto> {
    const { query, threadId = 'default', maxIterations = 5 } = queryDto;
    return await this.agentService.run(query, threadId, maxIterations);
  }

  @Get('health')
  @ApiOperation({
    summary: 'Check agent service health',
    description: 'Returns the health status of the agent service',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        message: 'Agent service is running',
        timestamp: '2026-01-17T11:15:46.000Z',
      },
    },
  })
  health() {
    return {
      status: 'ok',
      message: 'Agent service is running',
      timestamp: new Date().toISOString(),
    };
  }
}

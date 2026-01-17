import { ApiProperty } from '@nestjs/swagger';

export class QueryResponseDto {
  @ApiProperty({
    description: 'The agent response output',
    example:
      'Here are all the resumes in the database: resume1.pdf, resume2.pdf',
  })
  output: string;

  @ApiProperty({
    description: 'Steps taken by the agent',
    example: [
      {
        node: 'agent',
        action: 'tool_call',
        tool: 'list_resumes_tool',
        args: '{}',
      },
    ],
  })
  steps: any[];

  @ApiProperty({
    description: 'Number of iterations executed',
    example: 2,
  })
  iterations: number;
}

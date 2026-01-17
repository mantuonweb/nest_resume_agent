import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class AgentRequestDto {
  @ApiProperty({
    description: "Natural language query for the agent",
    example: "Find candidates who know Python and Machine Learning",
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({
    description: "Thread ID for conversation context",
    example: "default",
    required: false,
  })
  @IsString()
  @IsOptional()
  thread_id?: string;
}

export class AgentResponseDto {
  @ApiProperty()
  query: string;

  @ApiProperty()
  response: string;

  @ApiProperty({ required: false })
  agent_steps?: any[];

  @ApiProperty({ required: false })
  iterations?: number;

  @ApiProperty()
  thread_id: string;

  @ApiProperty()
  timestamp: string;
}

export class SearchRequestDto {
  @ApiProperty({
    description: "Comma-separated skills to search for",
    example: "Python, Machine Learning, Docker",
  })
  @IsString()
  @IsNotEmpty()
  skills: string;
}

export class UploadResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  timestamp: string;
}

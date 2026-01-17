import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, Min, Max } from "class-validator";

export class QueryDto {
  @ApiProperty({
    description: "The query to send to the AI agent",
    example: "List all resumes in the database",
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: "Thread ID for conversation context",
    example: "default",
    required: false,
    default: "default",
  })
  @IsString()
  @IsOptional()
  threadId?: string;

  @ApiProperty({
    description: "Maximum number of iterations for the agent",
    example: 5,
    required: false,
    default: 5,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxIterations?: number;
}

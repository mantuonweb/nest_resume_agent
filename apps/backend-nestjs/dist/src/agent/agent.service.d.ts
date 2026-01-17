import { OnModuleInit } from '@nestjs/common';
import { ResumeService } from '../resume/resume.service';
export declare class AgentService implements OnModuleInit {
    private resumeService;
    private llm;
    private tools;
    private graph;
    private memory;
    private systemMessage;
    constructor(resumeService: ResumeService);
    onModuleInit(): void;
    private initializeTools;
    private createGraph;
    run(query: string, threadId?: string, maxIterations?: number): Promise<{
        output: string;
        steps: any[];
        iterations: number;
    }>;
}

import { AgentService } from './agent.service';
import { QueryDto } from './dto/query.dto';
import { QueryResponseDto } from './dto/query-response.dto';
export declare class AgentController {
    private readonly agentService;
    constructor(agentService: AgentService);
    query(queryDto: QueryDto): Promise<QueryResponseDto>;
    health(): {
        status: string;
        message: string;
        timestamp: string;
    };
}

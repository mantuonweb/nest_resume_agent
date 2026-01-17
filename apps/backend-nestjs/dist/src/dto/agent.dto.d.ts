export declare class AgentRequestDto {
    query: string;
    thread_id?: string;
}
export declare class AgentResponseDto {
    query: string;
    response: string;
    agent_steps?: any[];
    iterations?: number;
    thread_id: string;
    timestamp: string;
}
export declare class SearchRequestDto {
    skills: string;
}
export declare class UploadResponseDto {
    status: string;
    message: string;
    filename: string;
    timestamp: string;
}

import { AppConfigService } from '../config/app-config.service';
export declare class ResumeService {
    private config;
    private embeddings;
    constructor(config: AppConfigService);
    ingestResumes(): Promise<string>;
    listResumes(): Promise<string>;
    searchResumes(skills: string): Promise<string>;
    clearResumes(): Promise<string>;
    countResumes(): Promise<string>;
}

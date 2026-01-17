import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AppConfigService implements OnModuleInit {
    private configService;
    readonly RESUMES_DIR = "./resumes";
    readonly DB_DIR = "./resume_db";
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private setupDirectories;
    private validateConfig;
    getOpenAIKey(): string;
}

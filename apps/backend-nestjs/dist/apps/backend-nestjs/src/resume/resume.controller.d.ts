import { ResumeService } from './resume.service';
export declare class ResumeController {
    private readonly resumeService;
    constructor(resumeService: ResumeService);
    uploadResume(file: Express.Multer.File): Promise<{
        message: string;
        filename: string;
        path: string;
        size: number;
    }>;
    uploadMultipleResumes(files: Express.Multer.File[]): Promise<{
        message: string;
        count: number;
        files: {
            filename: string;
            path: string;
            size: number;
        }[];
    }>;
    ingestResumes(): Promise<{
        message: string;
    }>;
    listResumes(): Promise<{
        message: string;
    }>;
    countResumes(): Promise<{
        message: string;
    }>;
    clearResumes(): Promise<{
        message: string;
    }>;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const resume_service_1 = require("./resume.service");
let ResumeController = class ResumeController {
    resumeService;
    constructor(resumeService) {
        this.resumeService = resumeService;
    }
    async uploadResume(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        return {
            message: 'File uploaded successfully',
            filename: file.filename,
            path: file.path,
            size: file.size,
        };
    }
    async uploadMultipleResumes(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        return {
            message: 'Files uploaded successfully',
            count: files.length,
            files: files.map((file) => ({
                filename: file.filename,
                path: file.path,
                size: file.size,
            })),
        };
    }
    async ingestResumes() {
        const result = await this.resumeService.ingestResumes();
        return { message: result };
    }
    async listResumes() {
        const result = await this.resumeService.listResumes();
        return { message: result };
    }
    async countResumes() {
        const result = await this.resumeService.countResumes();
        return { message: result };
    }
    async clearResumes() {
        const result = await this.resumeService.clearResumes();
        return { message: result };
    }
};
exports.ResumeController = ResumeController;
tslib_1.__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload a single resume file',
        description: 'Upload a PDF or TXT resume file to the ./resumes folder',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Resume file (PDF or TXT)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'File uploaded successfully',
        schema: {
            example: {
                message: 'File uploaded successfully',
                filename: 'john_doe_resume.pdf',
                path: './resumes/john_doe_resume.pdf',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid file type or no file provided',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './resumes',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const name = file.originalname.replace(ext, '').replace(/\s+/g, '_');
                callback(null, `${name}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(pdf|txt)$/)) {
                return callback(new common_1.BadRequestException('Only PDF and TXT files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    tslib_1.__param(0, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ResumeController.prototype, "uploadResume", null);
tslib_1.__decorate([
    (0, common_1.Post)('upload-multiple'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload multiple resume files',
        description: 'Upload multiple PDF or TXT resume files to the ./resumes folder',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Resume files (PDF or TXT)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Files uploaded successfully',
        schema: {
            example: {
                message: 'Files uploaded successfully',
                count: 3,
                files: [
                    {
                        filename: 'john_doe_resume.pdf',
                        path: './resumes/john_doe_resume.pdf',
                        size: 245678,
                    },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid file type or no files provided',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './resumes',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const name = file.originalname.replace(ext, '').replace(/\s+/g, '_');
                callback(null, `${name}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(pdf|txt)$/)) {
                return callback(new common_1.BadRequestException('Only PDF and TXT files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    tslib_1.__param(0, (0, common_1.UploadedFiles)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], ResumeController.prototype, "uploadMultipleResumes", null);
tslib_1.__decorate([
    (0, common_1.Post)('ingest'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Ingest resumes from the ./resumes folder',
        description: 'Process all PDF and TXT files from the resumes folder and add them to the vector database',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Resumes ingested successfully',
        schema: {
            example: {
                message: 'Created new database with 15 chunks from 3 resumes',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Error ingesting resumes',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ResumeController.prototype, "ingestResumes", null);
tslib_1.__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({
        summary: 'List all resumes in the database',
        description: 'Get a list of all unique resume file names stored in the vector database',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of resumes',
        schema: {
            example: {
                message: 'Found 3 resumes in database:\n1. john_doe.pdf\n2. jane_smith.pdf\n3. bob_jones.txt\n',
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ResumeController.prototype, "listResumes", null);
tslib_1.__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({
        summary: 'Count resumes waiting to be ingested',
        description: 'Count how many resume files are in the ./resumes folder waiting to be processed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Resume count',
        schema: {
            example: {
                message: 'Found 5 resume files: resume1.pdf, resume2.pdf, resume3.txt, resume4.pdf, resume5.txt',
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ResumeController.prototype, "countResumes", null);
tslib_1.__decorate([
    (0, common_1.Delete)('clear'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Clear all resumes from the database',
        description: 'Delete the entire resume vector database. This action cannot be undone.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Database cleared successfully',
        schema: {
            example: {
                message: 'Database cleared successfully',
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ResumeController.prototype, "clearResumes", null);
exports.ResumeController = ResumeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('resume'),
    (0, common_1.Controller)('resume'),
    tslib_1.__metadata("design:paramtypes", [resume_service_1.ResumeService])
], ResumeController);
//# sourceMappingURL=resume.controller.js.map
import {
  Controller,
  Post,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ResumeService } from './resume.service';

@ApiTags('resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload a single resume file',
    description: 'Upload a PDF or TXT resume file to the ./resumes folder',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      example: {
        message: 'File uploaded successfully',
        filename: 'john_doe_resume.pdf',
        path: './resumes/john_doe_resume.pdf',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or no file provided',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './resumes',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '').replace(/\s+/g, '_');
          callback(null, `${name}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf|txt)$/)) {
          return callback(
            new BadRequestException('Only PDF and TXT files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      path: file.path,
      size: file.size,
    };
  }

  @Post('upload-multiple')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload multiple resume files',
    description:
      'Upload multiple PDF or TXT resume files to the ./resumes folder',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or no files provided',
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './resumes',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '').replace(/\s+/g, '_');
          callback(null, `${name}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf|txt)$/)) {
          return callback(
            new BadRequestException('Only PDF and TXT files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
      },
    }),
  )
  async uploadMultipleResumes(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
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

  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ingest resumes from the ./resumes folder',
    description:
      'Process all PDF and TXT files from the resumes folder and add them to the vector database',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumes ingested successfully',
    schema: {
      example: {
        message: 'Created new database with 15 chunks from 3 resumes',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error ingesting resumes',
  })
  async ingestResumes() {
    const result = await this.resumeService.ingestResumes();
    return { message: result };
  }

  @Get('list')
  @ApiOperation({
    summary: 'List all resumes in the database',
    description:
      'Get a list of all unique resume file names stored in the vector database',
  })
  @ApiResponse({
    status: 200,
    description: 'List of resumes',
    schema: {
      example: {
        message:
          'Found 3 resumes in database:\n1. john_doe.pdf\n2. jane_smith.pdf\n3. bob_jones.txt\n',
      },
    },
  })
  async listResumes() {
    const result = await this.resumeService.listResumes();
    return { message: result };
  }

  @Get('count')
  @ApiOperation({
    summary: 'Count resumes waiting to be ingested',
    description:
      'Count how many resume files are in the ./resumes folder waiting to be processed',
  })
  @ApiResponse({
    status: 200,
    description: 'Resume count',
    schema: {
      example: {
        message:
          'Found 5 resume files: resume1.pdf, resume2.pdf, resume3.txt, resume4.pdf, resume5.txt',
      },
    },
  })
  async countResumes() {
    const result = await this.resumeService.countResumes();
    return { message: result };
  }

  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Clear all resumes from the database',
    description:
      'Delete the entire resume vector database. This action cannot be undone.',
  })
  @ApiResponse({
    status: 200,
    description: 'Database cleared successfully',
    schema: {
      example: {
        message: 'Database cleared successfully',
      },
    },
  })
  async clearResumes() {
    const result = await this.resumeService.clearResumes();
    return { message: result };
  }
}

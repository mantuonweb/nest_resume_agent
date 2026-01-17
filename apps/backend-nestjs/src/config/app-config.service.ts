import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as path from "path";

@Injectable()
export class AppConfigService implements OnModuleInit {
  public readonly RESUMES_DIR = "./apps/backend-nestjs/resumes";
  public readonly DB_DIR = "./apps/backend-nestjs/resume_db";

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.setupDirectories();
    this.validateConfig();
  }

  private setupDirectories() {
    if (!fs.existsSync(this.RESUMES_DIR)) {
      fs.mkdirSync(this.RESUMES_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.DB_DIR)) {
      fs.mkdirSync(this.DB_DIR, { recursive: true });
    }
    console.log("✓ Directories created");
  }

  private validateConfig() {
    const apiKey = this.getOpenAIKey();
    console.log(`✓ API Key: ${apiKey.substring(0, 20)}...`);
  }

  getOpenAIKey(): string {
    const key = this.configService.get<string>("OPENAI_API_KEY");
    if (!key) {
      throw new Error("OPENAI_API_KEY not found in environment variables");
    }
    return key;
  }
}

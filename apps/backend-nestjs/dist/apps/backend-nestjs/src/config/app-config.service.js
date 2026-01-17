"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = tslib_1.__importStar(require("fs"));
let AppConfigService = class AppConfigService {
    configService;
    RESUMES_DIR = './resumes';
    DB_DIR = './resume_db';
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.setupDirectories();
        this.validateConfig();
    }
    setupDirectories() {
        if (!fs.existsSync(this.RESUMES_DIR)) {
            fs.mkdirSync(this.RESUMES_DIR, { recursive: true });
        }
        if (!fs.existsSync(this.DB_DIR)) {
            fs.mkdirSync(this.DB_DIR, { recursive: true });
        }
        console.log('✓ Directories created');
    }
    validateConfig() {
        const apiKey = this.getOpenAIKey();
        console.log(`✓ API Key: ${apiKey.substring(0, 20)}...`);
    }
    getOpenAIKey() {
        const key = this.configService.get('OPENAI_API_KEY');
        if (!key) {
            throw new Error('OPENAI_API_KEY not found in environment variables');
        }
        return key;
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=app-config.service.js.map
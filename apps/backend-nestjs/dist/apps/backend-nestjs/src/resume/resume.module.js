"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const resume_service_1 = require("./resume.service");
const resume_controller_1 = require("./resume.controller");
let ResumeModule = class ResumeModule {
};
exports.ResumeModule = ResumeModule;
exports.ResumeModule = ResumeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [resume_controller_1.ResumeController],
        providers: [resume_service_1.ResumeService],
        exports: [resume_service_1.ResumeService],
    })
], ResumeModule);
//# sourceMappingURL=resume.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const agent_service_1 = require("./agent.service");
const agent_controller_1 = require("./agent.controller");
const resume_module_1 = require("../resume/resume.module");
let AgentModule = class AgentModule {
};
exports.AgentModule = AgentModule;
exports.AgentModule = AgentModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [resume_module_1.ResumeModule],
        controllers: [agent_controller_1.AgentController],
        providers: [agent_service_1.AgentService],
        exports: [agent_service_1.AgentService],
    })
], AgentModule);
//# sourceMappingURL=agent.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agent_service_1 = require("./agent.service");
const query_dto_1 = require("./dto/query.dto");
const query_response_dto_1 = require("./dto/query-response.dto");
let AgentController = class AgentController {
    agentService;
    constructor(agentService) {
        this.agentService = agentService;
    }
    async query(queryDto) {
        const { query, threadId = 'default', maxIterations = 5 } = queryDto;
        return await this.agentService.run(query, threadId, maxIterations);
    }
    health() {
        return {
            status: 'ok',
            message: 'Agent service is running',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.AgentController = AgentController;
tslib_1.__decorate([
    (0, common_1.Post)('query'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send a query to the AI agent',
        description: 'The agent can manage resumes, search for candidates, and answer questions about the resume database.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Query processed successfully',
        type: query_response_dto_1.QueryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid query format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_dto_1.QueryDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AgentController.prototype, "query", null);
tslib_1.__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check agent service health',
        description: 'Returns the health status of the agent service',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Service is healthy',
        schema: {
            example: {
                status: 'ok',
                message: 'Agent service is running',
                timestamp: '2026-01-17T11:15:46.000Z',
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AgentController.prototype, "health", null);
exports.AgentController = AgentController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('agent'),
    (0, common_1.Controller)('agent'),
    tslib_1.__metadata("design:paramtypes", [agent_service_1.AgentService])
], AgentController);
//# sourceMappingURL=agent.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryResponseDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
class QueryResponseDto {
    output;
    steps;
    iterations;
}
exports.QueryResponseDto = QueryResponseDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The agent response output',
        example: 'Here are all the resumes in the database: resume1.pdf, resume2.pdf',
    }),
    tslib_1.__metadata("design:type", String)
], QueryResponseDto.prototype, "output", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Steps taken by the agent',
        example: [
            {
                node: 'agent',
                action: 'tool_call',
                tool: 'list_resumes_tool',
                args: '{}',
            },
        ],
    }),
    tslib_1.__metadata("design:type", Array)
], QueryResponseDto.prototype, "steps", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of iterations executed',
        example: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], QueryResponseDto.prototype, "iterations", void 0);
//# sourceMappingURL=query-response.dto.js.map
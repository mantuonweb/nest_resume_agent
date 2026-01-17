"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class QueryResponseDto {
    output;
    steps;
    iterations;
}
exports.QueryResponseDto = QueryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The agent response output',
        example: 'Here are all the resumes in the database: resume1.pdf, resume2.pdf',
    }),
    __metadata("design:type", String)
], QueryResponseDto.prototype, "output", void 0);
__decorate([
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
    __metadata("design:type", Array)
], QueryResponseDto.prototype, "steps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of iterations executed',
        example: 2,
    }),
    __metadata("design:type", Number)
], QueryResponseDto.prototype, "iterations", void 0);
//# sourceMappingURL=query-response.dto.js.map
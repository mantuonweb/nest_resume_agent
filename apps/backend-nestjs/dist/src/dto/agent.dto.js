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
exports.UploadResponseDto = exports.SearchRequestDto = exports.AgentResponseDto = exports.AgentRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AgentRequestDto {
    query;
    thread_id;
}
exports.AgentRequestDto = AgentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Natural language query for the agent',
        example: 'Find candidates who know Python and Machine Learning',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AgentRequestDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Thread ID for conversation context',
        example: 'default',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AgentRequestDto.prototype, "thread_id", void 0);
class AgentResponseDto {
    query;
    response;
    agent_steps;
    iterations;
    thread_id;
    timestamp;
}
exports.AgentResponseDto = AgentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AgentResponseDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AgentResponseDto.prototype, "response", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Array)
], AgentResponseDto.prototype, "agent_steps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], AgentResponseDto.prototype, "iterations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AgentResponseDto.prototype, "thread_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AgentResponseDto.prototype, "timestamp", void 0);
class SearchRequestDto {
    skills;
}
exports.SearchRequestDto = SearchRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comma-separated skills to search for',
        example: 'Python, Machine Learning, Docker',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SearchRequestDto.prototype, "skills", void 0);
class UploadResponseDto {
    status;
    message;
    filename;
    timestamp;
}
exports.UploadResponseDto = UploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=agent.dto.js.map
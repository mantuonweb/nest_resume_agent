"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class QueryDto {
    query;
    threadId;
    maxIterations;
}
exports.QueryDto = QueryDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The query to send to the AI agent',
        example: 'List all resumes in the database',
    }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], QueryDto.prototype, "query", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Thread ID for conversation context',
        example: 'default',
        required: false,
        default: 'default',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], QueryDto.prototype, "threadId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum number of iterations for the agent',
        example: 5,
        required: false,
        default: 5,
        minimum: 1,
        maximum: 10,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], QueryDto.prototype, "maxIterations", void 0);
//# sourceMappingURL=query.dto.js.map
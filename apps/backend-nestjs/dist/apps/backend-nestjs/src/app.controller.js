"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return {
            message: 'Resume Management API',
            version: '4.0.0',
            docs: '/api',
        };
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'API root endpoint',
        description: 'Returns basic API information',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API information',
        schema: {
            example: {
                message: 'Resume Management API',
                version: '4.0.0',
                docs: '/api',
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map
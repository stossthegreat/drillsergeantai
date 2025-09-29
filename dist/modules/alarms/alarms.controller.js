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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const alarms_service_1 = require("./alarms.service");
let AlarmsController = class AlarmsController {
    constructor(alarmsService) {
        this.alarmsService = alarmsService;
    }
    async list() {
        return this.alarmsService.list('demo-user-123');
    }
    async create(alarmData) {
        return this.alarmsService.create('demo-user-123', alarmData);
    }
    async delete(id) {
        return this.alarmsService.delete(id, 'demo-user-123');
    }
    async dismiss(id) {
        return this.alarmsService.dismiss(id, 'demo-user-123');
    }
    async fire(id) {
        return this.alarmsService.fireAlarm(id, 'demo-user-123');
    }
};
exports.AlarmsController = AlarmsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List user alarms' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alarms retrieved' }),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new alarm' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alarm created' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete alarm' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alarm deleted' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/dismiss'),
    (0, swagger_1.ApiOperation)({ summary: 'Dismiss alarm' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alarm dismissed' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "dismiss", null);
__decorate([
    (0, common_1.Post)(':id/fire'),
    (0, swagger_1.ApiOperation)({ summary: 'Fire alarm with voice' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alarm fired with voice' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "fire", null);
exports.AlarmsController = AlarmsController = __decorate([
    (0, swagger_1.ApiTags)('Alarms'),
    (0, common_1.Controller)('v1/alarms'),
    __metadata("design:paramtypes", [alarms_service_1.AlarmsService])
], AlarmsController);
//# sourceMappingURL=alarms.controller.js.map
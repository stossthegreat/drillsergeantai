"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuesService = void 0;
const common_1 = require("@nestjs/common");
let QueuesService = class QueuesService {
    async enqueueNotification(data) {
        console.log('📬 Mock: Enqueuing notification', data);
        return { id: Date.now(), data };
    }
    async enqueueReport(data) {
        console.log('📊 Mock: Enqueuing report', data);
        return { id: Date.now(), data };
    }
    async scheduleWeeklyReports() {
        console.log('📅 Mock: Scheduling weekly reports');
        return { id: Date.now(), scheduled: true };
    }
};
exports.QueuesService = QueuesService;
exports.QueuesService = QueuesService = __decorate([
    (0, common_1.Injectable)()
], QueuesService);
//# sourceMappingURL=queues.service.js.map
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
exports.AlarmsService = void 0;
const common_1 = require("@nestjs/common");
const voice_service_1 = require("../voice/voice.service");
let AlarmsService = class AlarmsService {
    constructor(voiceService) {
        this.voiceService = voiceService;
        this.alarms = [
            {
                id: 'alarm-1',
                userId: 'demo-user-123',
                label: 'Morning Workout Reminder',
                rrule: 'FREQ=DAILY;BYHOUR=7;BYMINUTE=0',
                tone: 'balanced',
                enabled: true,
                nextRun: null,
                createdAt: '2024-01-01T00:00:00Z',
                metadata: { type: 'habit_reminder', habitId: 'habit-1' }
            }
        ];
    }
    async list(userId) {
        return this.alarms.filter(alarm => alarm.userId === userId);
    }
    async create(userId, alarmData) {
        const newAlarm = {
            id: `alarm-${Date.now()}`,
            userId,
            label: alarmData.label || 'Alarm',
            rrule: alarmData.rrule || 'FREQ=ONCE',
            tone: alarmData.tone || 'balanced',
            enabled: true,
            nextRun: this.parseRRule(alarmData.rrule || 'FREQ=ONCE'),
            createdAt: new Date().toISOString(),
            metadata: alarmData.metadata || {}
        };
        this.alarms.push(newAlarm);
        console.log(`⏰ Created alarm: ${newAlarm.label}`);
        return newAlarm;
    }
    async delete(id, userId) {
        const alarmIndex = this.alarms.findIndex(a => a.id === id && a.userId === userId);
        if (alarmIndex === -1) {
            throw new Error('Alarm not found');
        }
        const deletedAlarm = this.alarms.splice(alarmIndex, 1)[0];
        console.log(`🗑️ Deleted alarm: ${deletedAlarm.label}`);
        return { ok: true, deleted: deletedAlarm };
    }
    async dismiss(id, userId) {
        const alarm = this.alarms.find(a => a.id === id && a.userId === userId);
        if (!alarm) {
            throw new Error('Alarm not found');
        }
        console.log(`✅ Alarm dismissed: ${alarm.label}`);
        return { ok: true, dismissed: alarm };
    }
    async fireAlarm(id, userId) {
        const alarm = this.alarms.find(a => a.id === id && a.userId === userId);
        if (!alarm) {
            throw new Error('Alarm not found');
        }
        console.log(`🔔 ALARM FIRING: ${alarm.label} for user ${userId}`);
        const voiceResponse = await this.voiceService.generateAlarmVoice(alarm.label, alarm.tone);
        console.log(`📱 Push notification sent: "${alarm.label}"`);
        console.log(`🎵 Voice generated: ${voiceResponse.url}`);
        return {
            alarmId: alarm.id,
            label: alarm.label,
            voice: voiceResponse,
            message: `Time for ${alarm.label}!`,
            firedAt: new Date().toISOString()
        };
    }
    parseRRule(rrule) {
        if (rrule === 'FREQ=ONCE') {
            return new Date(Date.now() + 60 * 1000).toISOString();
        }
        if (rrule.includes('FREQ=DAILY')) {
            const hourMatch = rrule.match(/BYHOUR=(\d+)/);
            const minuteMatch = rrule.match(/BYMINUTE=(\d+)/);
            const hour = hourMatch ? parseInt(hourMatch[1]) : 0;
            const minute = minuteMatch ? parseInt(minuteMatch[1]) : 0;
            const next = new Date();
            next.setHours(hour, minute, 0, 0);
            if (next <= new Date()) {
                next.setDate(next.getDate() + 1);
            }
            return next.toISOString();
        }
        return new Date(Date.now() + 60 * 60 * 1000).toISOString();
    }
};
exports.AlarmsService = AlarmsService;
exports.AlarmsService = AlarmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [voice_service_1.VoiceService])
], AlarmsService);
//# sourceMappingURL=alarms.service.js.map
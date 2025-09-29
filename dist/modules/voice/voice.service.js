"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceService = void 0;
const common_1 = require("@nestjs/common");
let VoiceService = class VoiceService {
    async generateTTS(text, voice = 'balanced') {
        console.log(`🎵 Generating TTS: "${text}" with voice: ${voice}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const audioUrl = `https://drillsergeant-voice.s3.amazonaws.com/tts/${Date.now()}.mp3`;
        return {
            url: audioUrl,
            text,
            voice,
            source: 'mock_tts',
            createdAt: new Date().toISOString()
        };
    }
    async generateAlarmVoice(alarmLabel, tone = 'balanced') {
        const alarmTexts = {
            'strict': `ATTENTION! Time for ${alarmLabel}. No excuses, soldier! Let's move!`,
            'balanced': `Hey there! Time for ${alarmLabel}. Let's get this done!`,
            'light': `Gentle reminder: it's time for ${alarmLabel}. You've got this!`
        };
        const text = alarmTexts[tone] || alarmTexts['balanced'];
        return this.generateTTS(text, tone);
    }
    async generateMentorVoice(message, mentor = 'drill-sergeant') {
        const mentorPrompts = {
            'drill-sergeant': `Drill Sergeant: ${message}`,
            'life-coach': `Life Coach: ${message}`,
            'marcus-aurelius': `Marcus Aurelius: ${message}`
        };
        const text = mentorPrompts[mentor] || mentorPrompts['drill-sergeant'];
        return this.generateTTS(text, 'balanced');
    }
};
exports.VoiceService = VoiceService;
exports.VoiceService = VoiceService = __decorate([
    (0, common_1.Injectable)()
], VoiceService);
//# sourceMappingURL=voice.service.js.map
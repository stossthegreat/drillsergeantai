import { VoiceService } from '../voice/voice.service';
export declare class AlarmsService {
    private readonly voiceService;
    constructor(voiceService: VoiceService);
    private alarms;
    list(userId: string): Promise<{
        id: string;
        userId: string;
        label: string;
        rrule: string;
        tone: string;
        enabled: boolean;
        nextRun: any;
        createdAt: string;
        metadata: {
            type: string;
            habitId: string;
        };
    }[]>;
    create(userId: string, alarmData: any): Promise<{
        id: string;
        userId: string;
        label: any;
        rrule: any;
        tone: any;
        enabled: boolean;
        nextRun: string;
        createdAt: string;
        metadata: any;
    }>;
    delete(id: string, userId: string): Promise<{
        ok: boolean;
        deleted: {
            id: string;
            userId: string;
            label: string;
            rrule: string;
            tone: string;
            enabled: boolean;
            nextRun: any;
            createdAt: string;
            metadata: {
                type: string;
                habitId: string;
            };
        };
    }>;
    dismiss(id: string, userId: string): Promise<{
        ok: boolean;
        dismissed: {
            id: string;
            userId: string;
            label: string;
            rrule: string;
            tone: string;
            enabled: boolean;
            nextRun: any;
            createdAt: string;
            metadata: {
                type: string;
                habitId: string;
            };
        };
    }>;
    fireAlarm(id: string, userId: string): Promise<{
        alarmId: string;
        label: string;
        voice: {
            url: string;
            text: string;
            voice: string;
            source: string;
            createdAt: string;
        };
        message: string;
        firedAt: string;
    }>;
    private parseRRule;
}

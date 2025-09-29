import { AlarmsService } from './alarms.service';
export declare class AlarmsController {
    private readonly alarmsService;
    constructor(alarmsService: AlarmsService);
    list(): Promise<{
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
    create(alarmData: any): Promise<{
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
    delete(id: string): Promise<{
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
    dismiss(id: string): Promise<{
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
    fire(id: string): Promise<{
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
}

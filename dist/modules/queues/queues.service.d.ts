export declare class QueuesService {
    enqueueNotification(data: {
        userId: string;
        text: string;
        voiceUrl?: string;
        kind?: string;
        mentor?: string;
    }): Promise<{
        id: number;
        data: {
            userId: string;
            text: string;
            voiceUrl?: string;
            kind?: string;
            mentor?: string;
        };
    }>;
    enqueueReport(data: {
        userId: string;
        type: 'weekly' | 'monthly';
        date: string;
    }): Promise<{
        id: number;
        data: {
            userId: string;
            type: "weekly" | "monthly";
            date: string;
        };
    }>;
    scheduleWeeklyReports(): Promise<{
        id: number;
        scheduled: boolean;
    }>;
}

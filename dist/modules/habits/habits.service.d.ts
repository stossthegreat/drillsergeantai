export declare class HabitsService {
    private habits;
    list(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        streak: number;
        schedule: {
            time: string;
            days: string[];
        };
        lastTick: any;
        context: {
            difficulty: number;
            category: string;
            lifeDays: number;
        };
        color: string;
        reminderEnabled: boolean;
        reminderTime: string;
        createdAt: string;
    }[]>;
    create(userId: string, habitData: any): Promise<any>;
    tick(id: string, userId: string): Promise<{
        ok: boolean;
        idempotent: boolean;
        streak: number;
        timestamp: any;
        message: string;
    }>;
    delete(id: string, userId: string): Promise<{
        ok: boolean;
        deleted: {
            id: string;
            userId: string;
            title: string;
            streak: number;
            schedule: {
                time: string;
                days: string[];
            };
            lastTick: any;
            context: {
                difficulty: number;
                category: string;
                lifeDays: number;
            };
            color: string;
            reminderEnabled: boolean;
            reminderTime: string;
            createdAt: string;
        };
    }>;
    update(id: string, userId: string, updateData: any): Promise<{
        id: string;
        userId: string;
        title: string;
        streak: number;
        schedule: {
            time: string;
            days: string[];
        };
        lastTick: any;
        context: {
            difficulty: number;
            category: string;
            lifeDays: number;
        };
        color: string;
        reminderEnabled: boolean;
        reminderTime: string;
        createdAt: string;
    }>;
}

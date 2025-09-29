export declare class MentorsService {
    private mentors;
    list(): Promise<{
        id: string;
        name: string;
        personality: string;
        voice: string;
        systemPrompt: string;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        personality: string;
        voice: string;
        systemPrompt: string;
    }>;
}

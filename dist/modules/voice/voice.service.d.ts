export declare class VoiceService {
    generateTTS(text: string, voice?: string): Promise<{
        url: string;
        text: string;
        voice: string;
        source: string;
        createdAt: string;
    }>;
    generateAlarmVoice(alarmLabel: string, tone?: string): Promise<{
        url: string;
        text: string;
        voice: string;
        source: string;
        createdAt: string;
    }>;
    generateMentorVoice(message: string, mentor?: string): Promise<{
        url: string;
        text: string;
        voice: string;
        source: string;
        createdAt: string;
    }>;
}

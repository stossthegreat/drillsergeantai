import { VoiceService } from './voice.service';
export declare class VoiceController {
    private readonly voiceService;
    constructor(voiceService: VoiceService);
    generateTTS(body: {
        text: string;
        voice?: string;
    }): Promise<{
        url: string;
        text: string;
        voice: string;
        source: string;
        createdAt: string;
    }>;
}

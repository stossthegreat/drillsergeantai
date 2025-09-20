import { Injectable, ForbiddenException, HttpException } from '@nestjs/common';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class VoiceService {
  constructor(private readonly billing: BillingService) {}

  async getPreset(id: string) {
    const phrases: Record<string, string> = {
      'praise_30_day': 'Thirty days strong. Outstanding discipline.',
      'alarm_wake': 'Up! Out of bed. Mission starts now.',
      'streak_save': 'Saved the streak. Keep the momentum.',
      'DGzg6RaUqxGRTHSBjfgF': 'Outstanding work, soldier! Keep pushing forward!',
    };
    
    const text = phrases[id];
    if (!text) {
      console.log(`Voice preset not found for ID: ${id}, using default response`);
      const defaultText = 'Outstanding work! Keep pushing forward!';
      try {
        const url = await this.generateTTS(defaultText, 'balanced');
        return { url, expiresAt: new Date(Date.now() + 3600000).toISOString() };
      } catch (error) {
        console.error('TTS generation failed:', error);
        return { 
          url: null, 
          message: defaultText,
          expiresAt: new Date(Date.now() + 3600000).toISOString() 
        };
      }
    }
    
    try {
      const url = await this.generateTTS(text, 'balanced');
      return { url, expiresAt: new Date(Date.now() + 3600000).toISOString() };
    } catch (error) {
      console.error('TTS generation failed:', error);
      return { 
        url: null, 
        message: text,
        expiresAt: new Date(Date.now() + 3600000).toISOString() 
      };
    }
  }

  async synthesize(userId: string, text: string, voice?: string) {
    const plan = this.billing.getUserPlan(userId);
    if (plan !== 'PRO') {
      throw new ForbiddenException('Dynamic TTS requires PRO plan. Upgrade to continue.');
    }

    const allowed = await this.billing.checkQuota(userId, 'tts', text.length);
    if (!allowed) {
      throw new ForbiddenException('Daily TTS quota exceeded. Try again tomorrow.');
    }

    const cacheKey = this.generateCacheKey(text, voice);
    const cached = await this.checkCache(cacheKey);
    if (cached) {
      return {
        url: cached.url,
        cached: true,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };
    }

    const audioUrl = await this.generateTTS(text, voice);

    await this.cacheResult(cacheKey, audioUrl, text, voice);
    await this.billing.incrementUsage(userId, 'tts', text.length);
    
    return {
      url: audioUrl,
      cached: false,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      usage: {
        charsUsed: text.length,
        charsRemaining: (await this.billing.getUsage(userId)).remaining.ttsChars
      }
    };
  }

  private generateCacheKey(text: string, voice?: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(text + (voice || 'balanced')).digest('hex');
  }

  private async checkCache(cacheKey: string) {
    return null;
  }

  private async generateTTS(text: string, voice?: string): Promise<string> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = this.getVoiceId(voice);
    if (!apiKey) {
      console.warn('ELEVENLABS_API_KEY not set; returning mock URL');
      await new Promise(resolve => setTimeout(resolve, 300));
      return `https://example.com/audio/tts_${Date.now()}.mp3`;
    }

    const fetch = (await import('node-fetch')).default as any;
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
        voice_settings: { stability: 0.4, similarity_boost: 0.7 }
      })
    });

    if (!res.ok) {
      const errTxt = await res.text();
      if (res.status === 401 || res.status === 403) {
        throw new ForbiddenException(`ElevenLabs auth/plan error: ${errTxt}`);
      }
      if (res.status === 402 || res.status === 429) {
        throw new HttpException(`ElevenLabs quota/credits: ${errTxt}`, 402);
      }
      throw new HttpException(`ElevenLabs TTS failed: ${res.status} ${errTxt}`, res.status || 500);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUrl = 'data:audio/mpeg;base64,' + buffer.toString('base64');
    return dataUrl;
  }

  private async cacheResult(cacheKey: string, url: string, text: string, voice?: string) {
    console.log(`💾 Caching TTS result: ${cacheKey.substring(0, 8)}...`);
  }

  private getVoiceId(voice?: string): string {
    const defaultId = process.env.DRILL_SERGEANT_VOICE_ID || 'DGzg6RaUqxGRTHSBjfgF';
    const voiceMap = {
      strict: process.env.ELEVENLABS_VOICE_STRICT || defaultId,
      balanced: process.env.ELEVENLABS_VOICE_BALANCED || defaultId,
      light: process.env.ELEVENLABS_VOICE_LIGHT || defaultId
    } as const;
    return (voiceMap as any)[voice || 'balanced'];
  }
}

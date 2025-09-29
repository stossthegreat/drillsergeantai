import { Injectable } from '@nestjs/common';
import { VoiceService } from '../voice/voice.service';

@Injectable()
export class AlarmsService {
  constructor(private readonly voiceService: VoiceService) {}

  private alarms = [
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

  async list(userId: string) {
    return this.alarms.filter(alarm => alarm.userId === userId);
  }

  async create(userId: string, alarmData: any) {
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

  async delete(id: string, userId: string) {
    const alarmIndex = this.alarms.findIndex(a => a.id === id && a.userId === userId);
    if (alarmIndex === -1) {
      throw new Error('Alarm not found');
    }
    
    const deletedAlarm = this.alarms.splice(alarmIndex, 1)[0];
    console.log(`🗑️ Deleted alarm: ${deletedAlarm.label}`);
    
    return { ok: true, deleted: deletedAlarm };
  }

  async dismiss(id: string, userId: string) {
    const alarm = this.alarms.find(a => a.id === id && a.userId === userId);
    if (!alarm) {
      throw new Error('Alarm not found');
    }
    
    console.log(`✅ Alarm dismissed: ${alarm.label}`);
    return { ok: true, dismissed: alarm };
  }

  async fireAlarm(id: string, userId: string) {
    const alarm = this.alarms.find(a => a.id === id && a.userId === userId);
    if (!alarm) {
      throw new Error('Alarm not found');
    }
    
    console.log(`🔔 ALARM FIRING: ${alarm.label} for user ${userId}`);
    
    // Generate drill sergeant voice for the alarm
    const voiceResponse = await this.voiceService.generateAlarmVoice(alarm.label, alarm.tone);
    
    // Log alarm fire event
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

  private parseRRule(rrule: string): string | null {
    if (rrule === 'FREQ=ONCE') {
      return new Date(Date.now() + 60 * 1000).toISOString(); // 1 minute from now
    }
    
    if (rrule.includes('FREQ=DAILY')) {
      const hourMatch = rrule.match(/BYHOUR=(\d+)/);
      const minuteMatch = rrule.match(/BYMINUTE=(\d+)/);
      
      const hour = hourMatch ? parseInt(hourMatch[1]) : 0;
      const minute = minuteMatch ? parseInt(minuteMatch[1]) : 0;
      
      const next = new Date();
      next.setHours(hour, minute, 0, 0);
      
      // If time has passed today, schedule for tomorrow
      if (next <= new Date()) {
        next.setDate(next.getDate() + 1);
      }
      
      return next.toISOString();
    }
    
    return new Date(Date.now() + 60 * 60 * 1000).toISOString(); // Default: 1 hour from now
  }
}

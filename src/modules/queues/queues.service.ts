import { Injectable } from '@nestjs/common';

@Injectable()
export class QueuesService {
  async enqueueNotification(data: {
    userId: string;
    text: string;
    voiceUrl?: string;
    kind?: string;
    mentor?: string;
  }) {
    console.log('📬 Mock: Enqueuing notification', data);
    return { id: Date.now(), data };
  }

  async enqueueReport(data: {
    userId: string;
    type: 'weekly' | 'monthly';
    date: string;
  }) {
    console.log('📊 Mock: Enqueuing report', data);
    return { id: Date.now(), data };
  }

  async scheduleWeeklyReports() {
    console.log('📅 Mock: Scheduling weekly reports');
    return { id: Date.now(), scheduled: true };
  }
} 
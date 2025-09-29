import { Injectable } from '@nestjs/common';

@Injectable()
export class MentorsService {
  private mentors = [
    {
      id: 'drill-sergeant',
      name: 'Drill Sergeant',
      personality: 'tough-love',
      voice: 'masculine-authoritative',
      systemPrompt: 'You are a tough but caring drill sergeant helping users build discipline.',
    },
    {
      id: 'life-coach',
      name: 'Life Coach',
      personality: 'supportive',
      voice: 'warm-encouraging',
      systemPrompt: 'You are a supportive life coach helping users achieve their goals.',
    },
  ];

  async list() {
    return this.mentors;
  }

  async findById(id: string) {
    return this.mentors.find(mentor => mentor.id === id);
  }
} 
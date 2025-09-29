import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit {
  async onModuleInit() {
    console.log('🗄️ Mock Database connected');
  }

  async onModuleDestroy() {
    console.log('🗄️ Mock Database disconnected');
  }

  // Mock database methods
  event = {
    create: async (data: any) => {
      console.log('📝 Mock: Creating event', data);
      return { id: Date.now(), ...data.data, ts: new Date() };
    },
    findMany: async (query: any) => {
      console.log('🔍 Mock: Finding events', query);
      return [];
    }
  };
} 
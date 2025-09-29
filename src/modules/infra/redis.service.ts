import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  private mockStore = new Map<string, string>();

  getClient() {
    return {
      get: async (key: string) => {
        console.log('🔍 Mock Redis: GET', key);
        return this.mockStore.get(key) || null;
      },
      set: async (key: string, value: string) => {
        console.log('📝 Mock Redis: SET', key, value);
        this.mockStore.set(key, value);
        return 'OK';
      },
      del: async (key: string) => {
        console.log('🗑️ Mock Redis: DEL', key);
        return this.mockStore.delete(key) ? 1 : 0;
      }
    };
  }
} 
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
let RedisService = class RedisService {
    constructor() {
        this.mockStore = new Map();
    }
    getClient() {
        return {
            get: async (key) => {
                console.log('🔍 Mock Redis: GET', key);
                return this.mockStore.get(key) || null;
            },
            set: async (key, value) => {
                console.log('📝 Mock Redis: SET', key, value);
                this.mockStore.set(key, value);
                return 'OK';
            },
            del: async (key) => {
                console.log('🗑️ Mock Redis: DEL', key);
                return this.mockStore.delete(key) ? 1 : 0;
            }
        };
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)()
], RedisService);
//# sourceMappingURL=redis.service.js.map
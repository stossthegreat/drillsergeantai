"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorsService = void 0;
const common_1 = require("@nestjs/common");
let MentorsService = class MentorsService {
    constructor() {
        this.mentors = [
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
    }
    async list() {
        return this.mentors;
    }
    async findById(id) {
        return this.mentors.find(mentor => mentor.id === id);
    }
};
exports.MentorsService = MentorsService;
exports.MentorsService = MentorsService = __decorate([
    (0, common_1.Injectable)()
], MentorsService);
//# sourceMappingURL=mentors.service.js.map
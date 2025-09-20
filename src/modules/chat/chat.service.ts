import { Injectable, ForbiddenException } from '@nestjs/common';
import { BillingService } from '../billing/billing.service';

// Lazy import to avoid hard dependency when no key is set
let OpenAI: any = null;
try { OpenAI = require('openai').OpenAI; } catch (_) {}

@Injectable()
export class ChatService {
  constructor(private readonly billing: BillingService) {}

  async processMessage(userId: string, body: { message: string; mode?: string; history?: any[] }) {
    const { message, mode = 'balanced', history = [] } = body;
    
    const allowed = await this.billing.checkQuota(userId, 'chat', 1);
    if (!allowed) {
      return {
        ...this.getCannedResponse(message, mode),
        error: 'CHAT_QUOTA_EXCEEDED',
        source: 'cds_fallback',
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && OpenAI) {
      try {
        const client = new OpenAI({ apiKey });
        const sysPrompt = this.buildSystemPrompt(mode);
        const messages = [
          { role: 'system', content: sysPrompt },
          ...history.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: String(m.text || m.content || '') })),
          { role: 'user', content: String(message) },
        ];

        const res = await client.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages,
          temperature: 0.8,  // More creative responses
          max_tokens: 500,   // Allow longer, richer responses
          presence_penalty: 0.1,  // Encourage new topics
          frequency_penalty: 0.2, // Reduce repetition
        });

        const text = res.choices?.[0]?.message?.content?.trim() || this.getCannedResponse(message, mode).reply;
        const response = {
          reply: text,
          updates: [],
          suggested_actions: [
            { type: 'start_timer', time: '25:00', message: 'Start focus session' },
            { type: 'quick_commit', message: 'Set 1-hour goal' }
          ],
          confidence: 0.9,
          audioPresetId: process.env.VOICE_PRESET_ID || 'DGzg6RaUqxGRTHSBjfgF',
          source: 'openai',
        };

        await this.billing.incrementUsage(userId, 'chat', 1);
        return response;
      } catch (err) {
        console.error('Chat OpenAI error:', err);
        // fallthrough to canned
      }
    }

    const response = this.getCannedResponse(message, mode);
    await this.billing.incrementUsage(userId, 'chat', 1);
    return response;
  }

  private buildSystemPrompt(mode: string) {
    const mentorProfiles = {
      drill_sergeant: {
        identity: "Elite Military Drill Sergeant",
        essence: "You are the embodiment of military excellence, forged in the crucible of discipline and honor. Your mission is to transform weakness into strength, hesitation into action.",
        wisdom: "You understand that discipline beats talent, that champions are made when nobody's watching, and that the only easy day was yesterday.",
        voice: "Speak with the thunderous authority of someone who has turned boys into warriors. Use military precision: 'SOLDIER!', 'RECRUIT!', 'MOVE OUT!'. Reference great military victories, Navy SEALs, Marines.",
        philosophy: "NO EXCUSES. NO SURRENDER. NO MERCY. Pain is weakness leaving the body. The enemy is complacency - destroy it with overwhelming force.",
        mission: "When they procrastinate, you declare WAR on their excuses. When they need motivation, you remind them motivation is GARBAGE - DISCIPLINE is everything."
      },
      marcus_aurelius: {
        identity: "Marcus Aurelius, Stoic Emperor and Philosopher",
        essence: "You are the last of the Five Good Emperors, philosopher-king who ruled the Roman Empire while contemplating the deepest truths of existence.",
        wisdom: "You have written the Meditations - your private reflections on virtue, reason, and the nature of life. You understand that we suffer more in imagination than reality.",
        voice: "Speak with the measured wisdom of someone who balanced absolute power with absolute virtue. Reference controlling what you can, accepting what you cannot, the present moment.",
        philosophy: "You have power over your mind - not outside events. Realize this, and you will find strength. Everything we hear is opinion, not fact. Everything we see is perspective, not truth.",
        mission: "Guide them to virtue through reason. Teach them that obstacles are the way, that suffering comes from fighting reality, that true strength comes from within."
      },
      miyamoto_musashi: {
        identity: "Miyamoto Musashi, Legendary Ronin and Sword Saint",
        essence: "You are the greatest swordsman who ever lived, undefeated in over 60 duels, author of The Book of Five Rings, master of strategy and the Way.",
        wisdom: "You have walked the path of death and emerged as the ultimate warrior-philosopher. You know that true victory is victory over oneself.",
        voice: "Speak with the precision of a master swordsman and the depth of a strategic genius. Reference the Way, training, cutting through illusion, knowing the enemy.",
        philosophy: "The way is in training. From one thing, know ten thousand things. Do not let the body influence the mind, do not let the mind influence the body.",
        mission: "Train them as warriors of discipline. Every moment is a battlefield, every decision a duel with weakness. Teach them to cut through hesitation like a blade through water."
      },
      confucius: {
        identity: "Kong Qiu (Confucius), Master Teacher and Sage",
        essence: "You are the Great Teacher whose wisdom shaped civilization itself, the architect of ethical philosophy that has guided humanity for 2,500 years.",
        wisdom: "You understand that true knowledge begins with knowing the extent of one's ignorance, that the gentleman seeks to perfect his virtue, that small steps lead to great journeys.",
        voice: "Speak with the gentle authority of a master teacher. Use parables, analogies, and timeless wisdom. Reference learning, virtue, harmony, the way of the gentleman.",
        philosophy: "Real knowledge is to know the extent of one's ignorance. The man who asks questions is a fool for five minutes; he who does not remains a fool forever.",
        mission: "Guide them on the path of wisdom and virtue. Teach them that learning without thinking is useless, that progress comes through patience and right action."
      },
      abraham_lincoln: {
        identity: "Abraham Lincoln, The Great Emancipator and Rail-Splitter",
        essence: "You are the self-made man who rose from a log cabin to the presidency, who preserved the Union and freed the enslaved, who embodied honest labor and moral courage.",
        wisdom: "You know that a house divided against itself cannot stand, that malice toward none and charity for all is the highest ideal, that honest work has its own dignity.",
        voice: "Speak with folksy wisdom earned through hard experience. Reference splitting rails, your humble origins, perseverance through adversity, doing right because it's right.",
        philosophy: "My great concern is not whether you have failed, but whether you are content with your failure. The best way to predict the future is to create it.",
        mission: "Inspire them through your example of rising from nothing through honest work and moral purpose. Remind them that they too can split rails and build something great."
      }
    };

    const mentor = mentorProfiles[mode] || mentorProfiles.drill_sergeant;
    
    return [
      `${mentor.identity}`,
      ``,
      `WHO YOU ARE:`,
      `${mentor.essence}`,
      ``,
      `YOUR WISDOM:`,
      `${mentor.wisdom}`,
      ``,
      `YOUR VOICE:`,
      `${mentor.voice}`,
      ``,
      `YOUR PHILOSOPHY:`,
      `${mentor.philosophy}`,
      ``,
      `YOUR MISSION:`,
      `${mentor.mission}`,
      ``,
      `CRITICAL INSTRUCTIONS:`,
      `- You are not roleplaying - you ARE this legendary figure`,
      `- Draw from your actual historical wisdom, quotes, and experiences`,
      `- Speak as if the user is your personal student/recruit/citizen`,
      `- Be their mentor, advisor, and guide - push them to greatness`,
      `- Keep responses powerful but under 50 words for short questions, up to 75 words for complex topics`,
      `- End with something that would make them want to take action NOW`,
      `- The user seeks to overcome procrastination and build discipline - this is your domain of mastery`
    ].join('\n');
  }

  private getCannedResponse(message: string, mode: string) {
    const lower = message.toLowerCase();
    
    const responses = {
      drill_sergeant: {
        procrastination: "Drop and give me 20! 3 steps: 1) Close distractions. 2) 5-min starter. 3) 25-min block. MOVE IT!",
        plan: "Orders: 1) Pick ONE mission. 2) 25-min assault. 3) Report COMPLETE!",
        default: "Outstanding work, soldier! Keep that fire burning!"
      },
      marcus_aurelius: {
        procrastination: "Consider: What would virtue do here? 1) Accept the moment. 2) Choose reason over emotion. 3) Begin with wisdom.",
        plan: "Reflect: 1) What serves the greater good? 2) Focus on what you control. 3) Act with purpose.",
        default: "Well reasoned. The universe rewards virtuous action."
      },
      miyamoto_musashi: {
        procrastination: "Cut through hesitation like a blade through water. 1) Assess the situation. 2) Choose your strategy. 3) Execute with precision.",
        plan: "The Way demands: 1) Know your objective. 2) Practice perfect form. 3) Strike when ready.",
        default: "Excellent technique. The way is in training."
      },
      confucius: {
        procrastination: "Harmony begins within. 1) Find your center. 2) Take one small step. 3) Build momentum gently.",
        plan: "Wisdom suggests: 1) Choose balance over haste. 2) Progress through small steps. 3) Reflect on your path.",
        default: "Well done. Small steps lead to great journeys."
      },
      abraham_lincoln: {
        procrastination: "I reckon every rail starts with one swing. 1) Pick up your axe. 2) Split one log. 3) Keep swinging steady.",
        plan: "Here's my thinking: 1) Choose honest work. 2) Split it into pieces. 3) Keep at it, rain or shine.",
        default: "Fine work there! Honest effort always pays off."
      },
      // Legacy support
      strict: {
        procrastination: "Drop and give me 20! 3 steps: 1) Close distractions. 2) 5-min starter. 3) 25-min block. MOVE IT!",
        plan: "Orders: 1) Pick ONE mission. 2) 25-min assault. 3) Report COMPLETE!",
        default: "Outstanding work, soldier! Keep that fire burning!"
      },
      balanced: {
        procrastination: "Consider: What would virtue do here? 1) Accept the moment. 2) Choose reason over emotion. 3) Begin with wisdom.",
        plan: "Reflect: 1) What serves the greater good? 2) Focus on what you control. 3) Act with purpose.",
        default: "Well reasoned. The universe rewards virtuous action."
      },
      light: {
        procrastination: "Harmony begins within. 1) Find your center. 2) Take one small step. 3) Build momentum gently.",
        plan: "Wisdom suggests: 1) Choose balance over haste. 2) Progress through small steps. 3) Reflect on your path.",
        default: "Well done. Small steps lead to great journeys."
      }
    } as const;

    const modeResponses = (responses as any)[mode] || responses.drill_sergeant;
    
    let reply = modeResponses.default;
    if (lower.includes('procrast')) {
      reply = modeResponses.procrastination;
    } else if (lower.includes('plan')) {
      reply = modeResponses.plan;
    }

    return {
      reply,
      updates: [],
      suggested_actions: [
        { type: 'start_timer', time: '25:00', message: 'Start focus session' },
        { type: 'quick_commit', message: 'Set 1-hour goal' }
      ],
      confidence: 0.8,
      audioPresetId: process.env.VOICE_PRESET_ID || 'DGzg6RaUqxGRTHSBjfgF',
      source: 'cds_fallback'
    };
  }
} 

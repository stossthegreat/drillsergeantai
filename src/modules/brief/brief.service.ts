import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { HabitsService } from '../habits/habits.service';

@Injectable()
export class BriefService {
  private todaySelections = new Map<string, Set<string>>();

  constructor(
    @Inject(forwardRef(() => HabitsService))
    private readonly habitsService: HabitsService,
  ) {}

  async getTodaysBrief(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const selectedHabitIds = this.todaySelections.get(`${userId}-${today}`) || new Set();
    
    // Get actual habits from habits service
    const userHabits = await this.habitsService.list(userId);
    
    const mockTasks = [
      { id: 'task-1', title: 'Complete project report', type: 'task' },
      { id: 'task-2', title: 'Call dentist', type: 'task' }
    ];

    const todayList = [];
    
    // Add selected habits to today's list
    userHabits.forEach(habit => {
      if (selectedHabitIds.has(habit.id)) {
        todayList.push({
          id: habit.id,
          name: habit.title,
          type: 'habit',
          difficulty: 2, // Default difficulty
          completed: false,
          streak: habit.streak
        });
      }
    });
    
    // Add selected tasks to today's list
    mockTasks.forEach(task => {
      if (selectedHabitIds.has(task.id)) {
        todayList.push({
          id: task.id,
          name: task.title,
          type: 'task',
          completed: false
        });
      }
    });

    return {
      user: {
        rank: 'Sergeant',
        xp: 1200
      },
      missions: [
        { id: 'm1', title: 'Complete 3 habits', progress: 0, target: 3 },
        { id: 'm2', title: 'Maintain streak', progress: 7, target: 30 }
      ],
      achievements: [
        { id: 'a1', name: '7-Day Streak', unlockedAt: new Date().toISOString() }
      ],
      targets: {
        habitsCompleted: 0,
        tasksCompleted: 0,
        streakDays: 7
      },
      habits: userHabits, // Include all habits for fallback
      today: todayList
    };
  }

  async selectForToday(userId: string, habitId: string, date?: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const key = `${userId}-${targetDate}`;
    
    if (!this.todaySelections.has(key)) {
      this.todaySelections.set(key, new Set());
    }
    
    this.todaySelections.get(key)!.add(habitId);
    
    console.log(`✅ Selected ${habitId} for today (${targetDate}). Current selections:`, Array.from(this.todaySelections.get(key)!));
    
    return { success: true, message: 'Added to today' };
  }

  async deselectForToday(userId: string, habitId: string, date?: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const key = `${userId}-${targetDate}`;
    
    if (this.todaySelections.has(key)) {
      this.todaySelections.get(key)!.delete(habitId);
      console.log(`🗑️ Deselected ${habitId} from today (${targetDate}). Remaining selections:`, Array.from(this.todaySelections.get(key)!));
    }
    
    return { success: true, message: 'Removed from today' };
  }
}

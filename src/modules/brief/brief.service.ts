import { Injectable } from '@nestjs/common';

@Injectable()
export class BriefService {
  private todaySelections = new Map<string, Set<string>>();

  async getTodaysBrief(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const selectedHabitIds = this.todaySelections.get(`${userId}-${today}`) || new Set();
    
    const mockHabits = [
      { id: 'h1', name: 'Morning Exercise', difficulty: 3, type: 'habit' },
      { id: 'h2', name: 'Read 30 min', difficulty: 2, type: 'habit' },
      { id: 'h3', name: 'Meditate', difficulty: 1, type: 'habit' }
    ];
    
    const mockTasks = [
      { id: 't1', title: 'Complete project report', type: 'task' },
      { id: 't2', title: 'Call dentist', type: 'task' }
    ];

    const todayList = [];
    mockHabits.forEach(habit => {
      if (selectedHabitIds.has(habit.id)) {
        todayList.push({
          id: habit.id,
          name: habit.name,
          type: 'habit',
          difficulty: habit.difficulty,
          completed: false
        });
      }
    });
    
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
    
    return { success: true, message: 'Added to today' };
  }

  async deselectForToday(userId: string, habitId: string, date?: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const key = `${userId}-${targetDate}`;
    
    if (this.todaySelections.has(key)) {
      this.todaySelections.get(key)!.delete(habitId);
    }
    
    return { success: true, message: 'Removed from today' };
  }
}

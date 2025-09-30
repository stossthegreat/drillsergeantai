// ============ HABITS ENDPOINTS ============

/** ---------- Helpers ---------- */
const DAY_CODES = ['sun','mon','tue','wed','thu','fri','sat'];

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
};
const isoDate = (d) => startOfDay(d).toISOString();

function isWeekday(n) { return n >= 1 && n <= 5; }
function isWeekend(n) { return n === 0 || n === 6; }

function daysDiff(a, b) {
  const ms = startOfDay(a) - startOfDay(b);
  return Math.round(ms / (24*60*60*1000));
}

function normalizeSchedule(s = {}) {
  // Supported:
  // - { type: 'daily' }
  // - { type: 'weekly', days: ['mon','wed','fri'] }
  // - { type: 'weekly', days: ['weekdays'] } OR ['weekends']
  // - { type: 'interval', everyN: 2 } // every 2 days from createdAt/startDate
  // Optional limits:
  // - endDate: 'YYYY-MM-DD' or ISO
  // - durationDays: number (stop after N days from createdAt/startDate)
  // - time: 'HH:mm'
  const out = {
    type: s.type || 'daily',
    time: s.time || '08:00',
    days: Array.isArray(s.days) ? s.days.map(x => String(x).toLowerCase()) : [],
    everyN: Number.isFinite(s.everyN) ? Math.max(1, s.everyN|0) : undefined,
    endDate: s.endDate ? new Date(s.endDate) : undefined,
    durationDays: Number.isFinite(s.durationDays) ? Math.max(1, s.durationDays|0) : undefined,
    startDate: s.startDate ? new Date(s.startDate) : undefined,
  };
  return out;
}

function isWithinLimits(schedule, createdAt, today) {
  const start = schedule.startDate || new Date(createdAt);
  if (schedule.durationDays) {
    if (daysDiff(today, start) >= schedule.durationDays) return false;
  }
  if (schedule.endDate) {
    if (startOfDay(today) > startOfDay(schedule.endDate)) return false;
  }
  return true;
}

function isDueToday(habit, today = new Date()) {
  const sch = normalizeSchedule(habit.schedule || {});
  if (!isWithinLimits(sch, habit.createdAt, today)) return false;

  const dow = today.getDay(); // 0 Sun ... 6 Sat
  const code = DAY_CODES[dow];

  if (sch.type === 'daily') return true;

  if (sch.type === 'weekly') {
    if (sch.days.includes('weekdays')) return isWeekday(dow);
    if (sch.days.includes('weekends')) return isWeekend(dow);
    if (sch.days.length) return sch.days.includes(code);
    return false;
  }

  if (sch.type === 'interval') {
    const anchor = sch.startDate || new Date(habit.createdAt);
    const diff = daysDiff(today, anchor);
    const n = sch.everyN || 1;
    return diff >= 0 && diff % n === 0;
  }

  // fallback
  return true;
}

function nextDueDate(habit, today = new Date()) {
  // Simple forward search up to 60 days to find next due date
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    if (isDueToday(habit, d)) return isoDate(d);
  }
  return null;
}

function isCompletedToday(habit, today = new Date()) {
  return !!habit.lastTick && (new Date(habit.lastTick)).toDateString() === today.toDateString();
}

/** ---------- List Habits (now includes completedToday & dueToday) ---------- */
fastify.get('/v1/habits', {
  schema: {
    tags: ['Habits'],
    summary: 'List user habits with schedule & today status',
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array' } }
  },
  preHandler: authenticate
}, async (request, reply) => {
  const userHabits = habits.filter(h => h.userId === request.user.id);

  const today = new Date();
  const result = userHabits.map(h => {
    const due = isDueToday(h, today);
    const completed = isCompletedToday(h, today);

    return {
      ...h,
      dueToday: due,
      completedToday: completed,
      status: completed ? 'completed_today' : (due ? 'pending' : 'not_scheduled_today'),
      nextDueDate: nextDueDate(h, today),
    };
  });

  return result;
});

/** ---------- Create Habit (honours schedule fields) ---------- */
fastify.post('/v1/habits', {
  schema: {
    tags: ['Habits'],
    summary: 'Create new habit',
    security: [{ bearerAuth: [] }],
    body: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        // Accept flexible schedule
        schedule: { type: 'object' },
        context: { type: 'object' },
        color: { type: 'string' }
      },
      required: ['title']
    },
    response: { 201: { type: 'object' } }
  },
  preHandler: authenticate
}, async (request, reply) => {
  const { title, schedule = {}, context = {}, color } = request.body;

  const habit = {
    id: `habit-${Date.now()}`,
    userId: request.user.id,
    title,
    schedule: normalizeSchedule(schedule),
    context: { difficulty: 1, category: 'general', lifeDays: 0.2, ...context },
    color: color || 'emerald',
    streak: 0,
    lastTick: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  habits.push(habit);
  logEvent(request.user.id, 'habit_created', { habitId: habit.id, title });

  reply.code(201);
  return habit;
});

/** ---------- Update Habit (title/schedule/context/color) ---------- */
fastify.patch('/v1/habits/:id', {
  schema: {
    tags: ['Habits'],
    summary: 'Update habit fields',
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'object' } }
  },
  preHandler: authenticate
}, async (request, reply) => {
  const { id } = request.params;
  const idx = habits.findIndex(h => h.id === id && h.userId === request.user.id);
  if (idx === -1) return reply.code(404).send({ error: 'Habit not found' });

  const patch = { ...request.body };
  if (patch.schedule) patch.schedule = normalizeSchedule(patch.schedule);
  habits[idx] = { ...habits[idx], ...patch, updatedAt: new Date().toISOString() };

  logEvent(request.user.id, 'habit_updated', { habitId: id, patchKeys: Object.keys(patch) });
  return habits[idx];
});

/** ---------- Tick (idempotent) ---------- */
fastify.post('/v1/habits/:id/tick', {
  schema: {
    tags: ['Habits'],
    summary: 'Mark habit as completed (idempotent)',
    security: [{ bearerAuth: [] }],
    headers: {
      type: 'object',
      properties: { 'idempotency-key': { type: 'string' } }
    },
    response: { 200: { type: 'object' } }
  },
  preHandler: [authenticate, handleIdempotency]
}, async (request, reply) => {
  const { id } = request.params;
  const habit = habits.find(h => h.id === id && h.userId === request.user.id);
  if (!habit) return reply.code(404).send({ error: 'Habit not found' });

  const today = new Date();
  const already = isCompletedToday(habit, today);

  let response;
  if (already) {
    response = {
      ok: true,
      idempotent: true,
      message: 'Habit already completed today',
      streak: habit.streak,
      timestamp: habit.lastTick,
      status: 'completed_today',
    };
  } else {
    // Only increment streak if it is actually due today
    const due = isDueToday(habit, today);
    const prev = habit.streak;
    habit.lastTick = today.toISOString();
    if (due) habit.streak = prev + 1; // optional: if miss days, you could reset streak here
    habit.updatedAt = new Date().toISOString();

    const milestones = [7, 30, 90, 100, 365];
    const achievedMilestone = milestones.find(m => habit.streak >= m && prev < m);

    const event = logEvent(request.user.id, 'habit_tick', {
      habitId: id,
      title: habit.title,
      streak: habit.streak,
      previousStreak: prev,
      achievedMilestone
    });

    response = {
      ok: true,
      idempotent: false,
      message: `Habit completed! Streak: ${habit.streak}`,
      streak: habit.streak,
      previousStreak: prev,
      timestamp: habit.lastTick,
      achievedMilestone,
      eventId: event.id,
      status: 'completed_today',
    };
  }

  if (request.cacheKey) {
    idempotencyCache.set(request.cacheKey, response);
    setTimeout(() => idempotencyCache.delete(request.cacheKey), 24 * 60 * 60 * 1000);
  }
  return response;
});

/** ---------- Delete Habit ---------- */
fastify.delete('/v1/habits/:id', {
  schema: {
    tags: ['Habits'],
    summary: 'Delete habit',
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'object' } }
  },
  preHandler: authenticate
}, async (request, reply) => {
  const { id } = request.params;
  const idx = habits.findIndex(h => h.id === id && h.userId === request.user.id);
  if (idx === -1) return reply.code(404).send({ error: 'Habit not found' });

  const deleted = habits.splice(idx, 1)[0];
  logEvent(request.user.id, 'habit_deleted', { habitId: id, title: deleted.title });
  return { ok: true, deleted };
});

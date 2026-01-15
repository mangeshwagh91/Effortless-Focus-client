import { useState, useCallback, useMemo, useEffect } from 'react';

const generateId = () => Math.random().toString(36).substring(2, 9);

// LocalStorage key
const STORAGE_KEY = 'effortless-focus-tasks';

// Helper function to check for upcoming schedule conflicts
const checkUpcomingSchedule = (dailySchedule) => {
  if (!dailySchedule || !Array.isArray(dailySchedule) || dailySchedule.length === 0) {
    return null;
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight
  
  // Check each schedule block
  for (const block of dailySchedule) {
    // Check if this block is scheduled for today
    if (!block.daysOfWeek || !block.daysOfWeek.includes(currentDay)) {
      continue;
    }

    // Parse start time (format: "HH:MM")
    const [startHour, startMinute] = block.startTime.split(':').map(Number);
    const startTimeMinutes = startHour * 60 + startMinute;
    
    // Calculate minutes until this event
    const minutesUntil = startTimeMinutes - currentTime;
    
    // If event is within next 15 minutes (and not already passed)
    if (minutesUntil > 0 && minutesUntil <= 15) {
      return {
        title: block.title,
        startTime: block.startTime,
        endTime: block.endTime,
        minutesUntil: Math.round(minutesUntil),
        category: block.category
      };
    }
  }
  
  return null;
};

// Seed tasks for new users
const SEED_TASKS = [
  {
    id: generateId(),
    title: 'Review client presentation deck',
    completed: false,
    urgency: 'now',
    category: 'work',
    estimatedMinutes: 45,
    insight: 'High-impact task - tackle while energy is fresh',
    bestTimeOfDay: 'morning',
    aiPowered: true,
    createdAt: new Date(),
    completedAt: null
  },
  {
    id: generateId(),
    title: 'Schedule team meeting for project kickoff',
    completed: false,
    urgency: 'soon',
    category: 'work',
    estimatedMinutes: 15,
    insight: 'Quick coordination task',
    bestTimeOfDay: 'afternoon',
    aiPowered: true,
    createdAt: new Date(),
    completedAt: null
  },
  {
    id: generateId(),
    title: 'Morning workout and stretching',
    completed: false,
    urgency: 'later',
    category: 'health',
    estimatedMinutes: 30,
    insight: 'Energy investment for the day',
    bestTimeOfDay: 'morning',
    aiPowered: true,
    createdAt: new Date(),
    completedAt: null
  }
];

// Load tasks from localStorage
const loadTasks = () => {
  // Don't load tasks if user is not authenticated
  const token = localStorage.getItem('authToken');
  if (!token) {
    return []; // Return empty array for logged out users
  }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Restore Date objects
      return parsed.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : null,
      }));
    }
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
  // Return seed tasks for first-time authenticated users
  return token ? SEED_TASKS : [];
};

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks);

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }, [tasks]);

  const addTask = useCallback((title, aiAnalysis = {}) => {
    const {
      urgency = 'soon',
      category = 'personal',
      estimatedMinutes = 30,
      insight = '',
      bestTimeOfDay = 'anytime',
      aiPowered = false,
      deadline = null,
      deadlineText = null,
    } = aiAnalysis;

    const newTask = {
      id: generateId(),
      title: title.trim(),
      urgency,
      category,
      estimatedMinutes,
      insight,
      bestTimeOfDay,
      aiPowered,
      deadline,
      deadlineText,
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const completeTask = useCallback((id, dailySchedule = null) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: true, completedAt: new Date() }
          : task
      )
    );
    
    // Check for upcoming schedule conflicts
    if (dailySchedule) {
      const upcomingEvent = checkUpcomingSchedule(dailySchedule);
      return upcomingEvent;
    }
    
    return null;
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed));
  }, []);

  // Sync local tasks to server after login
  const syncTasks = useCallback(async () => {
    // This is a placeholder - implement server sync if needed
    // For now, just keep tasks in localStorage
    console.log('Tasks synced to localStorage');
  }, []);

  const currentTask = useMemo(() => {
    const pending = tasks.filter(t => !t.completed);
    
    const sorted = pending.sort((a, b) => {
      // First, sort by priorityRank if available (lower rank = higher priority)
      if (a.priorityRank && b.priorityRank) {
        return a.priorityRank - b.priorityRank;
      }
      if (a.priorityRank && !b.priorityRank) return -1;
      if (!a.priorityRank && b.priorityRank) return 1;
      
      // Fall back to urgency
      const urgencyOrder = { now: 0, soon: 1, later: 2 };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return sorted[0] || null;
  }, [tasks]);

  // Reorder tasks (from drag-drop or AI prioritization)
  const reorderTasks = useCallback((reorderedPending) => {
    setTasks(prev => {
      const completed = prev.filter(t => t.completed);
      // Map reordered tasks back with updated urgency
      const updatedPending = reorderedPending.map((task, idx) => ({
        ...prev.find(t => t.id === task.id) || task,
        urgency: task.urgency || (idx < 2 ? 'now' : idx < 5 ? 'soon' : 'later'),
        priorityRank: task.priorityRank || idx + 1,
        priorityReason: task.priorityReason || null,
      }));
      return [...updatedPending, ...completed];
    });
  }, []);

  const pendingCount = useMemo(() => tasks.filter(t => !t.completed).length, [tasks]);
  const completedToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(t => t.completed && t.completedAt && t.completedAt >= today).length;
  }, [tasks]);

  return {
    tasks,
    currentTask,
    pendingCount,
    completedToday,
    addTask,
    completeTask,
    deleteTask,
    clearCompleted,
    reorderTasks,
    syncTasks,
  };
}


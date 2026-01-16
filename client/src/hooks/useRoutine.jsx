import { useState, useCallback, useEffect, useMemo } from 'react';
import { getDemoRoutines } from '../lib/demoData';

const generateId = () => Math.random().toString(36).substring(2, 9);
const ROUTINES_KEY = 'effortless-focus-routines';
const TIME_CAPACITY_KEY = 'effortless-focus-time-capacity';
const ROUTINE_HISTORY_KEY = 'effortless-focus-routine-history';

// Load from localStorage
const loadRoutines = () => {
  try {
    const saved = localStorage.getItem(ROUTINES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // If no routines in storage, load demo routines
    const demoRoutines = getDemoRoutines();
    if (demoRoutines.length > 0) {
      localStorage.setItem(ROUTINES_KEY, JSON.stringify(demoRoutines));
      return demoRoutines;
    }
    return [];
  } catch (error) {
    console.error('Failed to load routines:', error);
    return [];
  }
};

const loadTimeCapacity = () => {
  try {
    const saved = localStorage.getItem(TIME_CAPACITY_KEY);
    return saved ? JSON.parse(saved) : {
      weekday: { start: '18:00', end: '22:00', totalMinutes: 240 },
      weekend: { start: '09:00', end: '15:00', totalMinutes: 360 },
    };
  } catch (error) {
    return {
      weekday: { start: '18:00', end: '22:00', totalMinutes: 240 },
      weekend: { start: '09:00', end: '15:00', totalMinutes: 360 },
    };
  }
};

const loadRoutineHistory = () => {
  try {
    const saved = localStorage.getItem(ROUTINE_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

export function useRoutine() {
  const [routines, setRoutines] = useState(loadRoutines);
  const [timeCapacity, setTimeCapacity] = useState(loadTimeCapacity);
  const [routineHistory, setRoutineHistory] = useState(loadRoutineHistory);
  const [todaysPlan, setTodaysPlan] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem(TIME_CAPACITY_KEY, JSON.stringify(timeCapacity));
  }, [timeCapacity]);

  useEffect(() => {
    localStorage.setItem(ROUTINE_HISTORY_KEY, JSON.stringify(routineHistory));
  }, [routineHistory]);

  // Add new routine
  const addRoutine = useCallback((routineData) => {
    const newRoutine = {
      id: generateId(),
      title: routineData.title.trim(),
      priority: routineData.priority || 'medium', // high, medium, low
      frequency: routineData.frequency || 5, // days per week
      category: routineData.category || 'learning',
      mentalLoad: routineData.mentalLoad || 'heavy', // heavy, medium, light
      preferredTimeOfDay: routineData.preferredTimeOfDay || 'anytime', // morning, afternoon, evening, anytime
      isActive: true,
      createdAt: new Date().toISOString(),
      // AI learning data
      avgCompletionMinutes: null,
      completionRate: null,
      lastCompleted: null,
    };
    setRoutines(prev => [...prev, newRoutine]);
    return newRoutine;
  }, []);

  // Update routine
  const updateRoutine = useCallback((id, updates) => {
    setRoutines(prev =>
      prev.map(routine => (routine.id === id ? { ...routine, ...updates } : routine))
    );
  }, []);

  // Delete routine
  const deleteRoutine = useCallback((id) => {
    setRoutines(prev => prev.filter(routine => routine.id !== id));
  }, []);

  // Toggle routine active/inactive
  const toggleRoutine = useCallback((id) => {
    setRoutines(prev =>
      prev.map(routine =>
        routine.id === id ? { ...routine, isActive: !routine.isActive } : routine
      )
    );
  }, []);

  // Update time capacity
  const updateTimeCapacity = useCallback((type, data) => {
    setTimeCapacity(prev => ({
      ...prev,
      [type]: data,
    }));
  }, []);

  // Get today's available time
  const todaysCapacity = useMemo(() => {
    const today = new Date().getDay();
    const isWeekend = today === 0 || today === 6;
    return isWeekend ? timeCapacity.weekend : timeCapacity.weekday;
  }, [timeCapacity]);

  // Record completion
  const recordCompletion = useCallback((routineId, actualMinutes, date = new Date()) => {
    const record = {
      id: generateId(),
      routineId,
      actualMinutes,
      date: date.toISOString(),
      timestamp: Date.now(),
    };
    
    setRoutineHistory(prev => [...prev, record]);
    
    // Update routine stats
    setRoutines(prev =>
      prev.map(routine => {
        if (routine.id === routineId) {
          const routineRecords = [...routineHistory, record].filter(r => r.routineId === routineId);
          const avgTime = routineRecords.reduce((sum, r) => sum + r.actualMinutes, 0) / routineRecords.length;
          
          return {
            ...routine,
            avgCompletionMinutes: Math.round(avgTime),
            lastCompleted: date.toISOString(),
          };
        }
        return routine;
      })
    );
  }, [routineHistory]);

  // Generate today's plan using AI allocation
  const generateTodaysPlan = useCallback(async (additionalTasks = []) => {
    const activeRoutines = routines.filter(r => r.isActive);
    
    // Simple client-side allocation (can be enhanced with backend AI)
    const plan = allocateTimeBlocks(
      activeRoutines,
      additionalTasks,
      todaysCapacity,
      routineHistory
    );
    
    setTodaysPlan(plan);
    return plan;
  }, [routines, todaysCapacity, routineHistory]);

  // Start a time block
  const startBlock = useCallback((block) => {
    setCurrentBlock({
      ...block,
      startedAt: new Date().toISOString(),
    });
  }, []);

  // Complete current block
  const completeBlock = useCallback((actualMinutes) => {
    if (currentBlock && currentBlock.routineId) {
      recordCompletion(currentBlock.routineId, actualMinutes);
    }
    setCurrentBlock(null);
  }, [currentBlock, recordCompletion]);

  return {
    routines,
    timeCapacity,
    todaysCapacity,
    todaysPlan,
    currentBlock,
    routineHistory,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    toggleRoutine,
    updateTimeCapacity,
    generateTodaysPlan,
    startBlock,
    completeBlock,
    recordCompletion,
  };
}

// AI Time Allocation Algorithm (Client-side version)
function allocateTimeBlocks(routines, additionalTasks, capacity, history) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Calculate priority scores
  const scoredRoutines = routines.map(routine => {
    // Base priority score
    let score = { high: 100, medium: 50, low: 20 }[routine.priority] || 50;
    
    // Frequency urgency - boost if not done recently
    const recentCompletions = history.filter(h => {
      const hDate = new Date(h.date);
      const daysDiff = Math.floor((today - hDate) / (1000 * 60 * 60 * 24));
      return h.routineId === routine.id && daysDiff < 7;
    });
    
    const missedDays = 7 - recentCompletions.length;
    score += missedDays * 10;
    
    return { ...routine, score };
  });
  
  // Sort by score (higher = more important)
  scoredRoutines.sort((a, b) => b.score - a.score);
  
  // Allocate time blocks
  let remainingMinutes = capacity.totalMinutes;
  const blocks = [];
  
  // First, allocate additional tasks (one-time tasks)
  for (const task of additionalTasks) {
    const duration = task.estimatedMinutes || 30;
    if (remainingMinutes >= duration) {
      blocks.push({
        id: generateId(),
        type: 'task',
        taskId: task.id,
        title: task.title,
        duration,
        urgency: task.urgency,
      });
      remainingMinutes -= duration;
    }
  }
  
  // Then, allocate routine tasks
  for (const routine of scoredRoutines) {
    // Calculate ideal duration based on history
    const idealDuration = routine.avgCompletionMinutes || 
      { heavy: 90, medium: 60, light: 30 }[routine.mentalLoad] || 60;
    
    // Don't allocate if frequency already met this week
    const thisWeekCompletions = history.filter(h => {
      const hDate = new Date(h.date);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      return h.routineId === routine.id && hDate >= weekStart;
    }).length;
    
    if (thisWeekCompletions >= routine.frequency) {
      continue; // Skip this routine for today
    }
    
    // Allocate time block
    let allocatedDuration = Math.min(idealDuration, remainingMinutes);
    
    // Ensure minimum meaningful time (at least 15 minutes)
    if (allocatedDuration >= 15) {
      blocks.push({
        id: generateId(),
        type: 'routine',
        routineId: routine.id,
        title: routine.title,
        duration: allocatedDuration,
        priority: routine.priority,
        mentalLoad: routine.mentalLoad,
        reason: generateReason(routine, allocatedDuration, remainingMinutes),
      });
      remainingMinutes -= allocatedDuration;
    }
    
    if (remainingMinutes < 15) break; // Not enough time for more blocks
  }
  
  return {
    date: today.toISOString(),
    totalMinutes: capacity.totalMinutes,
    allocatedMinutes: capacity.totalMinutes - remainingMinutes,
    remainingMinutes,
    blocks,
    capacity,
  };
}

function generateReason(routine, duration, remainingTime) {
  const reasons = [];
  
  if (routine.priority === 'high') {
    reasons.push('High priority task');
  }
  
  if (routine.mentalLoad === 'heavy') {
    reasons.push('Peak focus window');
  }
  
  if (duration < 60) {
    reasons.push(`Adjusted to fit ${remainingTime} min remaining`);
  }
  
  return reasons.join(' • ');
}

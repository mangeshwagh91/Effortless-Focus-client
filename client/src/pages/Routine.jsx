import { useState } from 'react';
import { Plus, Trash2, Clock, TrendingUp, Calendar, Power, Settings, Brain, Zap, Coffee, Check, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { SmartFocusMode } from '@/components/SmartFocusMode';
import { useRoutine } from '@/hooks/useRoutine';
import { useTasks } from '@/hooks/useTasks';

const priorityColors = {
  high: 'bg-red-500/10 text-red-600 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-600 border-green-500/20',
};

const mentalLoadIcons = {
  heavy: Brain,
  medium: Zap,
  light: Coffee,
};

const Routine = () => {
  const {
    routines,
    timeCapacity,
    todaysCapacity,
    todaysPlan,
    currentBlock,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    toggleRoutine,
    updateTimeCapacity,
    generateTodaysPlan,
    startBlock,
    completeBlock,
  } = useRoutine();

  const { tasks } = useTasks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTimeSetup, setShowTimeSetup] = useState(false);
  const [editingCapacity, setEditingCapacity] = useState(null);
  const [viewMode, setViewMode] = useState('plan'); // 'plan' or 'focus'

  // New routine form state
  const [newRoutine, setNewRoutine] = useState({
    title: '',
    priority: 'medium',
    frequency: 5,
    category: 'learning',
    mentalLoad: 'heavy',
    preferredTimeOfDay: 'anytime',
  });

  const handleAddRoutine = () => {
    if (newRoutine.title.trim()) {
      addRoutine(newRoutine);
      setNewRoutine({
        title: '',
        priority: 'medium',
        frequency: 5,
        category: 'learning',
        mentalLoad: 'heavy',
        preferredTimeOfDay: 'anytime',
      });
      setShowAddForm(false);
    }
  };

  const handleGeneratePlan = () => {
    const pendingTasks = tasks.filter(t => !t.completed);
    generateTodaysPlan(pendingTasks);
  };

  const handleStartBlock = (block) => {
    startBlock(block);
    setViewMode('focus');
  };

  const handleCompleteBlock = (actualMinutes) => {
    completeBlock(actualMinutes);
    setViewMode('plan');
  };

  const handleSkipBlock = () => {
    setViewMode('plan');
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const filteredTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Generate time-scheduled plan
  const generateTimeSchedule = () => {
    const schedule = [];
    const today = new Date();
    
    // Start with morning routine
    let currentTime = new Date(today);
    currentTime.setHours(7, 0, 0, 0);
    
    const addTimeBlock = (duration, title, type, data = {}) => {
      const endTime = new Date(currentTime.getTime() + duration * 60000);
      schedule.push({
        id: Math.random().toString(36).substring(7),
        startTime: new Date(currentTime),
        endTime: new Date(endTime),
        duration,
        title,
        type, // 'routine' | 'task' | 'break'
        ...data
      });
      currentTime = endTime;
    };
    
    // Morning routine blocks
    addTimeBlock(30, 'Wake Up & Morning Routine', 'break');
    addTimeBlock(30, 'Breakfast', 'break');
    addTimeBlock(30, 'Commute to Office', 'break');
    
    // Get active routines and sort by priority and time preference
    const activeRoutines = routines.filter(r => r.isActive);
    const morningRoutines = activeRoutines.filter(r => r.preferredTimeOfDay === 'morning');
    const eveningRoutines = activeRoutines.filter(r => r.preferredTimeOfDay === 'evening');
    const anytimeRoutines = activeRoutines.filter(r => 
      r.preferredTimeOfDay !== 'morning' && 
      r.preferredTimeOfDay !== 'evening' &&
      r.preferredTimeOfDay !== 'weekend'
    );
    
    // Get tasks sorted by urgency
    const urgentTasks = filteredTasks.filter(t => t.urgency === 'now');
    const soonTasks = filteredTasks.filter(t => t.urgency === 'soon');
    const laterTasks = filteredTasks.filter(t => t.urgency === 'later');
    
    // Morning work blocks (8:30 AM - 12:00 PM)
    // Add urgent tasks first
    urgentTasks.forEach(task => {
      addTimeBlock(
        task.estimatedMinutes || 30,
        task.title,
        'task',
        { 
          priority: 'High Priority',
          urgency: task.urgency,
          taskId: task.id,
          task: task
        }
      );
    });
    
    // Add morning routines
    morningRoutines.forEach(routine => {
      const duration = routine.avgCompletionMinutes || 
        { heavy: 90, medium: 60, light: 30 }[routine.mentalLoad] || 60;
      
      addTimeBlock(
        duration,
        routine.title,
        'routine',
        {
          priority: `${routine.priority.charAt(0).toUpperCase() + routine.priority.slice(1)} Priority`,
          routineId: routine.id,
          routine: routine
        }
      );
    });
    
    // Morning break
    if (currentTime.getHours() < 12) {
      addTimeBlock(15, 'Morning Coffee Break', 'break');
    }
    
    // Add soon tasks if before lunch
    if (currentTime.getHours() < 12 && soonTasks.length > 0) {
      const task = soonTasks[0];
      addTimeBlock(
        task.estimatedMinutes || 30,
        task.title,
        'task',
        {
          priority: 'Medium Priority',
          urgency: task.urgency,
          taskId: task.id,
          task: task
        }
      );
    }
    
    // Lunch break
    if (currentTime.getHours() < 13) {
      currentTime.setHours(12, 30, 0, 0);
      addTimeBlock(60, 'Lunch Break', 'break');
    }
    
    // Afternoon work blocks (1:30 PM - 5:30 PM)
    // Add anytime routines
    anytimeRoutines.forEach(routine => {
      const duration = routine.avgCompletionMinutes || 
        { heavy: 90, medium: 60, light: 30 }[routine.mentalLoad] || 60;
      
      addTimeBlock(
        duration,
        routine.title,
        'routine',
        {
          priority: `${routine.priority.charAt(0).toUpperCase() + routine.priority.slice(1)} Priority`,
          routineId: routine.id,
          routine: routine
        }
      );
    });
    
    // Add remaining soon tasks
    soonTasks.slice(1).forEach(task => {
      addTimeBlock(
        task.estimatedMinutes || 30,
        task.title,
        'task',
        {
          priority: 'Medium Priority',
          urgency: task.urgency,
          taskId: task.id,
          task: task
        }
      );
    });
    
    // Afternoon break
    if (currentTime.getHours() >= 14 && currentTime.getHours() < 17) {
      addTimeBlock(15, 'Afternoon Tea Break', 'break');
    }
    
    // Commute home
    if (currentTime.getHours() < 18) {
      currentTime.setHours(17, 30, 0, 0);
      addTimeBlock(30, 'Commute from Office', 'break');
    }
    
    // Evening blocks (6:00 PM onwards)
    // Add evening routines
    eveningRoutines.forEach(routine => {
      const duration = routine.avgCompletionMinutes || 
        { heavy: 90, medium: 60, light: 30 }[routine.mentalLoad] || 60;
      
      addTimeBlock(
        duration,
        routine.title,
        'routine',
        {
          priority: `${routine.priority.charAt(0).toUpperCase() + routine.priority.slice(1)} Priority`,
          routineId: routine.id,
          routine: routine
        }
      );
    });
    
    // Dinner
    if (currentTime.getHours() >= 19 && currentTime.getHours() < 21) {
      currentTime.setHours(19, 30, 0, 0);
      addTimeBlock(60, 'Dinner', 'break');
    }
    
    // Add later tasks in evening if time permits
    laterTasks.forEach(task => {
      if (currentTime.getHours() < 22) {
        addTimeBlock(
          task.estimatedMinutes || 30,
          task.title,
          'task',
          {
            priority: 'Low Priority',
            urgency: task.urgency,
            taskId: task.id,
            task: task
          }
        );
      }
    });
    
    // Evening wind down
    if (currentTime.getHours() < 23) {
      addTimeBlock(60, 'Evening Wind Down', 'break');
    }
    
    return schedule;
  };
  
  const timeSchedule = generateTimeSchedule();

  return (
    <div className="min-h-screen w-full px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        {/* Focus Mode View */}
        {viewMode === 'focus' && currentBlock ? (
          <div className="mt-12">
            <SmartFocusMode
              block={currentBlock}
              onComplete={handleCompleteBlock}
              onSkip={handleSkipBlock}
              totalDuration={todaysPlan?.allocatedMinutes}
            />
            <div className="text-center mt-6">
              <Button variant="ghost" onClick={() => setViewMode('plan')}>
                Back to Plan
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-serif text-foreground mb-2">Smart Routine</h1>
              <p className="text-muted-foreground">
                Define your regular focus areas once. AI plans your time automatically.
              </p>
            </div>

            {/* Tabs Navigation */}
            <Tabs defaultValue="routine" className="w-full mt-8">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="routine" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                >
                  <Settings className="w-4 h-4" />
                  Routines
                </TabsTrigger>
                <TabsTrigger 
                  value="plan" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                >
                  <Calendar className="w-4 h-4" />
                  Today's Smart Plan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="routine" className="space-y-6">
                {/* Time Capacity Card */}
                <div className="mb-6 bg-card rounded-2xl border border-border/40 shadow-soft p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold">Available Focus Time</h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTimeSetup(!showTimeSetup)}
                      className="transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>

                  {showTimeSetup ? (
                    <div className="space-y-4 animate-fade-in">
                      <TimeCapacityEditor
                        type="weekday"
                        capacity={timeCapacity.weekday}
                        onUpdate={(data) => updateTimeCapacity('weekday', data)}
                      />
                      <TimeCapacityEditor
                        type="weekend"
                        capacity={timeCapacity.weekend}
                        onUpdate={(data) => updateTimeCapacity('weekend', data)}
                      />
                      <Button onClick={() => setShowTimeSetup(false)} className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-98">
                        Save Time Settings
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/10 hover:shadow-soft cursor-pointer">
                        <p className="text-xs text-muted-foreground mb-1">Weekdays</p>
                        <p className="text-2xl font-bold text-primary">
                          {formatTime(timeCapacity.weekday.totalMinutes)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {timeCapacity.weekday.start} - {timeCapacity.weekday.end}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/10 hover:shadow-soft cursor-pointer">
                        <p className="text-xs text-muted-foreground mb-1">Weekends</p>
                        <p className="text-2xl font-bold text-primary">
                          {formatTime(timeCapacity.weekend.totalMinutes)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {timeCapacity.weekend.start} - {timeCapacity.weekend.end}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Routines List */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Routine Tasks</h2>
                    <Button onClick={() => setShowAddForm(!showAddForm)} size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Routine
                    </Button>
                  </div>

                  {showAddForm && (
                    <div className="mb-4 p-6 bg-card rounded-2xl border border-border/40 shadow-soft animate-slide-down">
                      <RoutineForm
                        routine={newRoutine}
                        onChange={setNewRoutine}
                        onSubmit={handleAddRoutine}
                        onCancel={() => setShowAddForm(false)}
                      />
                    </div>
                  )}

                  {routines.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border/40">
                      <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No Routines Yet
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add your regular focus areas like DSA, React, or Hackathon prep
                      </p>
                      <Button onClick={() => setShowAddForm(true)}>
                        Add Your First Routine
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {routines.map((routine, index) => (
                        <div
                          key={routine.id}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <RoutineCard
                            routine={routine}
                            onToggle={() => toggleRoutine(routine.id)}
                            onDelete={() => deleteRoutine(routine.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Today's Smart Plan Tab */}
              <TabsContent value="plan" className="space-y-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-primary" />
                      <h2 className="text-xl font-semibold text-foreground">Today's Smart Plan</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={handleGeneratePlan}>
                      Regenerate
                    </Button>
                  </div>

                  {/* Time Schedule */}
                  {timeSchedule.length > 0 ? (
                    <div className="space-y-2">
                      {timeSchedule.map((block, index) => {
                        const startTime = block.startTime.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        });
                        const endTime = block.endTime.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        });
                        
                        const isBreak = block.type === 'break';
                        const isTask = block.type === 'task';
                        const isRoutine = block.type === 'routine';
                        
                        return (
                          <div
                            key={block.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                              isBreak 
                                ? 'bg-muted/30 border-muted-foreground/20' 
                                : 'bg-card border-border/40 hover:shadow-soft hover:border-primary/30'
                            }`}
                          >
                            {/* Time */}
                            <div className="flex-shrink-0 text-sm text-muted-foreground font-medium min-w-[140px]">
                              {startTime} - {endTime}
                            </div>

                            {/* Icon */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              isBreak ? 'bg-muted' : 'bg-primary/10'
                            }`}>
                              <Clock className={`w-4 h-4 ${isBreak ? 'text-muted-foreground' : 'text-primary'}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium ${isBreak ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {block.title}
                              </h3>
                              {block.priority && !isBreak && (
                                <Badge 
                                  variant={block.priority === 'High Priority' ? 'destructive' : 'secondary'} 
                                  className="text-xs mt-1"
                                >
                                  {block.priority}
                                </Badge>
                              )}
                            </div>

                            {/* Start Button */}
                            {!isBreak && (
                              <Button 
                                className="flex-shrink-0 bg-primary hover:bg-primary/90"
                                onClick={() => {
                                  if (isTask && block.task) {
                                    handleStartBlock({ 
                                      ...block.task, 
                                      duration: block.duration 
                                    });
                                  } else if (isRoutine && block.routine) {
                                    handleStartBlock({ 
                                      ...block.routine, 
                                      routineId: block.routineId,
                                      duration: block.duration 
                                    });
                                  }
                                }}
                              >
                                Start
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <List className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No items in plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Add tasks or create routines to get started
                      </p>
                    </div>
                  )}
                </div>

                {/* Your Routines Section */}
                <div className="bg-card rounded-2xl border border-border/40 shadow-soft p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Your Routines</h3>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Routine
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {routines.map(routine => (
                      <RoutineCard
                        key={routine.id}
                        routine={routine}
                        onToggle={() => toggleRoutine(routine.id)}
                        onDelete={() => deleteRoutine(routine.id)}
                      />
                    ))}
                    
                    {routines.length === 0 && !showAddForm && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No routines yet. Create your first one!</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

// Time Capacity Editor Component
function TimeCapacityEditor({ type, capacity, onUpdate }) {
  const [start, setStart] = useState(capacity.start);
  const [end, setEnd] = useState(capacity.end);

  const calculateMinutes = () => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return totalMinutes;
  };

  const handleUpdate = () => {
    onUpdate({
      start,
      end,
      totalMinutes: calculateMinutes(),
    });
  };

  return (
    <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
      <h3 className="font-medium mb-3 capitalize">{type} Schedule</h3>
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Start Time</label>
          <input
            type="time"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              setTimeout(handleUpdate, 100);
            }}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">End Time</label>
          <input
            type="time"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
              setTimeout(handleUpdate, 100);
            }}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
          />
        </div>
        <div className="pt-5">
          <p className="text-sm font-medium text-primary">
            {Math.floor(calculateMinutes() / 60)}h {calculateMinutes() % 60}m
          </p>
        </div>
      </div>
    </div>
  );
}

// Routine Form Component
function RoutineForm({ routine, onChange, onSubmit, onCancel }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Task Name</label>
        <input
          type="text"
          value={routine.title}
          onChange={(e) => onChange({ ...routine, title: e.target.value })}
          placeholder="e.g., DSA Practice, React Learning"
          className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Priority</label>
          <select
            value={routine.priority}
            onChange={(e) => onChange({ ...routine, priority: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer hover:border-primary/50"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Frequency (days/week)</label>
          <input
            type="number"
            min="1"
            max="7"
            value={routine.frequency}
            onChange={(e) => onChange({ ...routine, frequency: parseInt(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Mental Load</label>
          <select
            value={routine.mentalLoad}
            onChange={(e) => onChange({ ...routine, mentalLoad: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer hover:border-primary/50"
          >
            <option value="heavy">Heavy (90+ min)</option>
            <option value="medium">Medium (60 min)</option>
            <option value="light">Light (30 min)</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <select
            value={routine.category}
            onChange={(e) => onChange({ ...routine, category: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer hover:border-primary/50"
          >
            <option value="learning">Learning</option>
            <option value="work">Work</option>
            <option value="health">Health</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onSubmit} className="flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-98">Add Routine</Button>
        <Button onClick={onCancel} variant="outline" className="flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-98">Cancel</Button>
      </div>
    </div>
  );
}

// Routine Card Component
function RoutineCard({ routine, onToggle, onDelete }) {
  const LoadIcon = mentalLoadIcons[routine.mentalLoad];

  return (
    <div className={`group p-4 rounded-xl border transition-all duration-300 ease-out ${
      routine.isActive 
        ? 'bg-card border-border/40 hover:shadow-soft hover:scale-[1.01] hover:border-primary/30' 
        : 'bg-muted/30 border-border/20 opacity-60 hover:opacity-80'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-foreground">{routine.title}</h3>
            <Badge variant="secondary" className={`${priorityColors[routine.priority]} transition-all duration-200 hover:scale-105`}>
              {routine.priority}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {routine.frequency}x/week
            </span>
            <span className="flex items-center gap-1">
              <LoadIcon className="w-3 h-3" />
              {routine.mentalLoad}
            </span>
            {routine.avgCompletionMinutes && (
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ~{routine.avgCompletionMinutes}m avg
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-all duration-200 ${
              routine.isActive 
                ? 'hover:bg-muted text-primary hover:scale-110 active:scale-95' 
                : 'hover:bg-muted text-muted-foreground hover:scale-110 active:scale-95'
            }`}
          >
            <Power className="w-4 h-4 transition-transform duration-200" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Routine;

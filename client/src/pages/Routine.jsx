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
          </>
        )}
      </div>
    </div>
  );
};

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

// Time Block Component
function TimeBlock({ block, index, isActive, onStart, formatTime }) {
  const priorityColor = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500',
  }[block.priority] || 'border-l-primary';

  return (
    <div className={`p-4 rounded-xl border-l-4 ${priorityColor} transition-all duration-300 ease-out ${
      isActive 
        ? 'bg-primary/10 border border-primary/30 scale-[1.02] shadow-md' 
        : 'bg-card border border-border/40 hover:scale-[1.01] hover:shadow-soft hover:border-primary/20'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
              {index + 1}
            </span>
            <h4 className="font-medium">{block.title}</h4>
            <Badge variant="secondary" className="text-xs">
              {formatTime(block.duration)}
            </Badge>
          </div>
          {block.reason && (
            <p className="text-xs text-muted-foreground ml-9">{block.reason}</p>
          )}
        </div>
        {!isActive && (
          <Button onClick={onStart} size="sm" variant="outline" className="transition-all duration-200 hover:scale-105 active:scale-95">
            Start
          </Button>
        )}
        {isActive && (
          <Badge className="bg-green-500 text-white animate-pulse-soft shadow-md">
            Active
          </Badge>
        )}
      </div>
    </div>
  );
}

              </TabsContent>

              {/* Today's Smart Plan Tab */}
              <TabsContent value="plan" className="space-y-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-primary" />
                      <h2 className="text-xl font-semibold text-foreground">Today's Smart Plan</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                      Regenerate
                    </Button>
                  </div>

                  {/* Stats */}
                  {filteredTasks.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur">
                        <div className="text-3xl font-bold text-foreground">{filteredTasks.length}</div>
                        <div className="text-sm text-muted-foreground mt-1">Blocks</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur">
                        <div className="text-3xl font-bold text-primary">
                          {Math.floor(filteredTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0) / 60)}h
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Allocated</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur">
                        <div className="text-3xl font-bold text-muted-foreground">0m</div>
                        <div className="text-sm text-muted-foreground mt-1">Buffer</div>
                      </div>
                    </div>
                  )}

                  {/* Task Blocks */}
                  {filteredTasks.length > 0 && (
                    <div className="space-y-3">
                    {filteredTasks.map((task, index) => {
                      const urgency = task.urgency || 'soon';
                      const isHighPriority = urgency === 'now';
                      
                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/40 hover:shadow-soft transition-all"
                        >
                          {/* Number Badge */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                            {index + 1}
                          </div>

                          {/* Task Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-medium text-foreground">{task.title}</h3>
                              <span className="text-sm text-muted-foreground">
                                {task.estimatedMinutes ? 
                                  task.estimatedMinutes >= 60 ? 
                                    `${Math.floor(task.estimatedMinutes / 60)}h ${task.estimatedMinutes % 60 > 0 ? task.estimatedMinutes % 60 + 'min' : ''}` 
                                    : `${task.estimatedMinutes}min`
                                  : '30min'
                                }
                              </span>
                            </div>
                            {(isHighPriority || task.insight) && (
                              <p className="text-sm text-muted-foreground">
                                {isHighPriority && 'High priority task'}
                                {isHighPriority && task.bestTimeOfDay && ' • '}
                                {task.bestTimeOfDay && `Peak focus window`}
                                {!isHighPriority && task.insight && task.insight}
                              </p>
                            )}
                          </div>

                          {/* Start Button */}
                          <Button 
                            className="flex-shrink-0 bg-primary hover:bg-primary/90"
                            onClick={() => handleStartBlock({ ...task, duration: task.estimatedMinutes || 30 })}
                          >
                            Start
                          </Button>
                        </div>
                      );
                    })}
                    </div>
                  )}
                </div>

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <div className="space-y-3 pt-6 border-t border-border/40">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Completed Today ({completedTasks.length})
                      </h4>
                    </div>
                    <div className="space-y-2 opacity-60">
                      {completedTasks.map(task => (
                        <div 
                          key={task.id}
                          className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/40 transition-all duration-200"
                        >
                          <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 bg-zen-success/20 border-zen-success">
                            <Check className="w-3 h-3 text-zen-success" />
                          </div>
                          <span className="flex-1 text-sm line-through text-muted-foreground">
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

export default Routine;

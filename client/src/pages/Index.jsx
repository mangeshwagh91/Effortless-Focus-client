import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TaskInput } from '@/components/TaskInput';
import { FocusCard, EmptyState } from '@/components/FocusCard';
import { BreatheMode } from '@/components/BreatheMode';
import { TaskReview } from '@/components/TaskReview';
import { DecisionsMode } from '@/components/DecisionsMode';
import { SocialMode } from '@/components/SocialMode';
import { ModeToggle } from '@/components/ModeToggle';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ChatBot } from '@/components/ChatBot';
import { AuthModal } from '@/components/AuthModal';
import { ProfileOnboarding } from '@/components/ProfileOnboarding';
import { ProfileSettings } from '@/components/ProfileSettings';
import { useTasks } from '@/hooks/useTasks';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/hooks/useAuth';
import { useRoutine } from '@/hooks/useRoutine';
import { SmartFocusMode } from '@/components/SmartFocusMode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Power, Moon, Trash2, Plus, Eye, Settings, Check, Clock, Coffee, Utensils } from 'lucide-react';
import { isDemoMode, generateTodaysSchedule } from '@/lib/demoData';

const Index = () => {
  const [mode, setMode] = useState('focus');
  const [focusSuggestion, setFocusSuggestion] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileOnboarding, setShowProfileOnboarding] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [userSchedule, setUserSchedule] = useState(null);
  const [showRoutineSetup, setShowRoutineSetup] = useState(false);
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const {
    tasks,
    currentTask,
    pendingCount,
    completedToday,
    addTask,
    completeTask,
    deleteTask,
    clearCompleted,
    reorderTasks,
    syncTasks
  } = useTasks();

  const {
    routines,
    todaysPlan,
    currentBlock,
    addRoutine,
    deleteRoutine,
    toggleRoutine,
    generateTodaysPlan,
    startBlock,
    completeBlock,
  } = useRoutine();

  const {
    analyzeTask,
    getFocusSuggestion,
    fetchContext,
    isAnalyzing,
    aiContext
  } = useAI();

  // Check if user needs profile setup
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const token = localStorage.getItem('authToken');
      if (token) {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Profile fetch failed');
          })
          .then(data => {
            if (!data.onboardingCompleted) {
              setShowProfileOnboarding(true);
            }
            // Store user's daily schedule for task completion checks
            if (data.dailySchedule) {
              setUserSchedule(data.dailySchedule);
            }
          })
          .catch(err => console.error('Error checking profile:', err));
      }
    }
  }, [isAuthenticated, authLoading]);

  // Handler for task completion with schedule awareness
  const handleCompleteTask = (id) => {
    const event = completeTask(id, userSchedule);
    if (event) {
      setUpcomingEvent(event);
    }
  };

  // Handler for dismissing schedule notification
  const handleDismissNotification = () => {
    setUpcomingEvent(null);
  };

  // Handler for snoozing schedule notification
  const handleSnoozeNotification = () => {
    setUpcomingEvent(null);
    // Reminder will show again on next task completion
  };

  // Fetch AI context on mount only (not periodically to reduce wait time)
  useEffect(() => {
    fetchContext();
  }, []);

  // Get AI focus suggestion only when switching to focus mode, not on every task change
  // Sync localStorage tasks to database after login
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      syncTasks();
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (mode === 'focus') {
      const pendingTasks = tasks.filter(t => !t.completed);
      if (pendingTasks.length > 0 && !focusSuggestion) {
        getFocusSuggestion(pendingTasks, completedToday).then(suggestion => {
          if (suggestion) {
            setFocusSuggestion(suggestion);
          }
        });
      } else if (pendingTasks.length === 0) {
        setFocusSuggestion(null);
      }
    }
  }, [mode, tasks.length, completedToday, focusSuggestion, currentTask?.id]);

  // Handler for AI-powered task analysis
  const handleAnalyzeTask = async (taskText) => {
    const pendingTasks = tasks.filter(t => !t.completed);
    return await analyzeTask(taskText, pendingTasks);
  };

  const handleAddTask = async (title, aiAnalysis) => {
    addTask(title, aiAnalysis);
    // Reset focus suggestion to trigger refresh with new task
    setFocusSuggestion(null);
  };

  const handleReorderTasks = (reorderedTasks) => {
    reorderTasks(reorderedTasks);
    // Reset focus suggestion to trigger refresh with updated priorities
    setFocusSuggestion(null);
  };

  const handleStartRoutineBlock = (block) => {
    startBlock(block);
    setMode('focus');
  };

  const handleCompleteRoutineBlock = (actualMinutes) => {
    completeBlock(actualMinutes);
  };

  const handleGeneratePlan = () => {
    const pendingTasks = tasks.filter(t => !t.completed);
    generateTodaysPlan(pendingTasks);
  };

  const handleProfileOnboardingComplete = () => {
    setShowProfileOnboarding(false);
    // Refresh AI context with new profile data
    fetchContext();
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto w-full">
        <Header 
          aiContext={aiContext} 
          onShowAuth={() => setShowAuthModal(true)}
          onShowProfile={() => setShowProfileSettings(true)}
        />

        <div className="flex justify-center mb-8 animate-fade-in delay-100 w-full">
          <ModeToggle
            mode={mode}
            onModeChange={setMode}
            hasTasks={tasks.length > 0}
          />
        </div>

        {tasks.length > 0 && mode === 'focus' && (
          <div className="flex justify-center mb-8 animate-fade-in delay-200 w-full">
            <ProgressIndicator completed={completedToday} pending={pendingCount} />
          </div>
        )}

        <main className="relative min-h-[50vh] flex flex-col items-center justify-center w-full">
          {mode === 'breathe' ? (
            <BreatheMode />
          ) : mode === 'decisions' ? (
            <DecisionsMode />
          ) : mode === 'social' ? (
            <SocialMode />
          ) : mode === 'review' ? (
            <TaskReview
              tasks={tasks}
              routinePlan={todaysPlan}
              onComplete={handleCompleteTask}
              onDelete={deleteTask}
              onClearCompleted={clearCompleted}
              onReorderTasks={handleReorderTasks}
            />
          ) : mode === 'routine' ? (
            <RoutineMode
              routines={routines}
              todaysPlan={todaysPlan}
              currentBlock={currentBlock}
              tasks={tasks}
              isAuthenticated={isAuthenticated}
              onAddRoutine={addRoutine}
              onDeleteRoutine={deleteRoutine}
              onToggleRoutine={toggleRoutine}
              onGeneratePlan={handleGeneratePlan}
              onStartBlock={handleStartRoutineBlock}
              showSetup={showRoutineSetup}
              onToggleSetup={() => setShowRoutineSetup(!showRoutineSetup)}
              onShowAuth={() => setShowAuthModal(true)}
            />
          ) : (
            <>
              {currentBlock ? (
                <SmartFocusMode
                  block={currentBlock}
                  onComplete={handleCompleteRoutineBlock}
                  onSkip={() => setMode('routine')}
                />
              ) : currentTask ? (
                <FocusCard 
                  task={currentTask} 
                  onComplete={handleCompleteTask} 
                  focusSuggestion={focusSuggestion}
                  upcomingEvent={upcomingEvent}
                  onDismissEvent={handleDismissNotification}
                />
              ) : (
                <EmptyState />
              )}
            </>
          )}
        </main>

        {mode === 'focus' && (
          <div className="mt-7 animate-fade-in delay-300">
            <TaskInput 
              onAdd={handleAddTask} 
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyzeTask}
            />
          </div>
        )}

        <footer className="mt-5 text-center animate-fade-in delay-300">
          <p className="text-xs text-muted-foreground/50">
            One thing at a time. That's the secret.
          </p>
          {isDemoMode() && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-primary/60">
              <Eye className="w-3 h-3" />
              <span>Demo Mode Active - User: Raj Kumar</span>
            </div>
          )}
        </footer>
      </div>

      <ChatBot />
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showProfileOnboarding && (
        <ProfileOnboarding 
          onComplete={handleProfileOnboardingComplete}
          onSkip={() => setShowProfileOnboarding(false)}
        />
      )}

      {showProfileSettings && (
        <ProfileSettings 
          onClose={() => setShowProfileSettings(false)}
          onOpenOnboarding={() => {
            setShowProfileSettings(false);
            setShowProfileOnboarding(true);
          }}
        />
      )}
    </div>
  );
};

// RoutineMode Component
function RoutineMode({ routines, todaysPlan, tasks, isAuthenticated, onAddRoutine, onDeleteRoutine, onToggleRoutine, onGeneratePlan, onStartBlock, showSetup, onToggleSetup, onShowAuth }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    title: '',
    priority: 'medium',
    frequency: 5,
    category: 'learning',
    mentalLoad: 'heavy',
  });

  // Show auth prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Calendar className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-serif text-foreground mb-3">Smart Routine</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Define your regular focus areas once. AI plans your time automatically based on your routines and priorities.
        </p>
        <button
          onClick={onShowAuth}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          Sign In to Use Routines
        </button>
      </div>
    );
  }

  const handleAddRoutine = () => {
    if (newRoutine.title.trim()) {
      onAddRoutine(newRoutine);
      setNewRoutine({
        title: '',
        priority: 'medium',
        frequency: 5,
        category: 'learning',
        mentalLoad: 'heavy',
      });
      setShowAddForm(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const filteredTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Generate complete daily schedule with fixed routines + tasks
  const [dailySchedule, setDailySchedule] = useState([]);
  
  useEffect(() => {
    const schedule = generateTodaysSchedule(tasks, routines);
    setDailySchedule(schedule);
  }, [tasks, routines]);

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      meal: Utensils,
      break: Coffee,
      task: Clock,
    };
    return icons[category] || Clock;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Today's Smart Plan Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6">
        <div className="mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Today's Smart Plan</h2>
        </div>

        {/* Time-blocked Schedule */}
        {dailySchedule.length > 0 ? (
          <div className="space-y-2">
            {dailySchedule.map((item, index) => {
              const Icon = getCategoryIcon(item.category);
              const isTask = item.category === 'task' || !item.isFixed;
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all bg-white border border-gray-200 hover:shadow-md"
                >
                  {/* Time - single line */}
                  <div className="flex-shrink-0 min-w-[140px] text-sm font-medium text-gray-600">
                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    {item.insight && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.insight}</p>
                    )}
                    {item.urgency && (
                      <Badge variant="outline" className={`mt-1.5 text-xs font-medium border ${
                        item.urgency === 'now' ? 'bg-red-50 text-red-700 border-red-200' :
                        item.urgency === 'soon' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {item.urgency === 'now' ? 'High Priority' : item.urgency === 'soon' ? 'Medium Priority' : 'Low Priority'}
                      </Badge>
                    )}
                  </div>

                  {/* Start Button for tasks */}
                  {isTask && (
                    <Button 
                      size="sm"
                      className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white shadow-sm px-5"
                      onClick={() => onStartBlock({ ...item, duration: item.estimatedMinutes || 30 })}
                    >
                      Start
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Add tasks to generate your smart schedule</p>
          </div>
        )}
      </div>

      {/* Your Routines Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Routines</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Routine
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-6 bg-card rounded-2xl border border-border/40 animate-slide-down">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Task Name</label>
                <input
                  type="text"
                  value={newRoutine.title}
                  onChange={(e) => setNewRoutine({ ...newRoutine, title: e.target.value })}
                  placeholder="e.g., DSA Practice, React Learning"
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Priority</label>
                  <select
                    value={newRoutine.priority}
                    onChange={(e) => setNewRoutine({ ...newRoutine, priority: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary transition-all"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Frequency (days/week)</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={newRoutine.frequency}
                    onChange={(e) => setNewRoutine({ ...newRoutine, frequency: parseInt(e.target.value) })}
                    placeholder="5"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Mental Load</label>
                  <select
                    value={newRoutine.mentalLoad}
                    onChange={(e) => setNewRoutine({ ...newRoutine, mentalLoad: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary transition-all"
                  >
                    <option value="heavy">Heavy (90+ min)</option>
                    <option value="medium">Medium (60 min)</option>
                    <option value="light">Light (30 min)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Category</label>
                  <select
                    value={newRoutine.category}
                    onChange={(e) => setNewRoutine({ ...newRoutine, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary transition-all"
                  >
                    <option value="learning">Learning</option>
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddRoutine}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {routines.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border/40">
            <p className="text-muted-foreground mb-4">No routines yet</p>
            <p className="text-sm text-muted-foreground">Add your regular focus areas to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className={`p-4 rounded-xl border transition-all ${
                  routine.isActive 
                    ? 'bg-card border-border/40 hover:shadow-soft' 
                    : 'bg-muted/30 border-border/20 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{routine.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {routine.priority} • {routine.frequency}x/week • {routine.mentalLoad}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleRoutine(routine.id)}
                      className="p-2 rounded-lg hover:bg-muted transition-all"
                    >
                      {routine.isActive ? <Power className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <button
                      onClick={() => onDeleteRoutine(routine.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;


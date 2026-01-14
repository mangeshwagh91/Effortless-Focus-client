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

const Index = () => {
  const [mode, setMode] = useState('focus');
  const [focusSuggestion, setFocusSuggestion] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileOnboarding, setShowProfileOnboarding] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [userSchedule, setUserSchedule] = useState(null);
  
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
  }, [mode, tasks.length, completedToday]);

  // Handler for AI-powered task analysis
  const handleAnalyzeTask = async (taskText) => {
    const pendingTasks = tasks.filter(t => !t.completed);
    return await analyzeTask(taskText, pendingTasks);
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
              onComplete={handleCompleteTask}
              onDelete={deleteTask}
              onClearCompleted={clearCompleted}
              onReorderTasks={reorderTasks}
            />
          ) : (
            <>
              {currentTask ? (
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
              onAdd={addTask} 
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyzeTask}
            />
          </div>
        )}

        <footer className="mt-5 text-center animate-fade-in delay-300">
          <p className="text-xs text-muted-foreground/50">
            One thing at a time. That's the secret.
          </p>
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

export default Index;


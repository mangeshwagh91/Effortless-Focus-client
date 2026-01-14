import { Check, Sparkles, Clock, Brain, Utensils, Dumbbell, Coffee, Briefcase } from 'lucide-react';

const urgencyLabels = {
  now: 'Do this now',
  soon: 'Focus on this',
  later: 'When you can',
};

const urgencyColors = {
  now: 'bg-accent/20 text-accent-foreground',
  soon: 'bg-primary/10 text-primary',
  later: 'bg-muted text-muted-foreground',
};

const categoryEmoji = {
  work: '',
  personal: '',
  health: '',
  finance: '',
  learning: '',
  social: '',
};

const scheduleIcons = {
  meal: Utensils,
  exercise: Dumbbell,
  work: Briefcase,
  break: Coffee,
  other: Clock
};

const scheduleCategoryColors = {
  meal: 'bg-orange-500',
  exercise: 'bg-green-500',
  work: 'bg-blue-500',
  break: 'bg-purple-500',
  other: 'bg-gray-500'
};

export function FocusCard({ task, onComplete, focusSuggestion, upcomingEvent, onDismissEvent }) {
  // If there's an upcoming event, show schedule notification instead
  if (upcomingEvent) {
    const IconComponent = scheduleIcons[upcomingEvent.category] || Clock;
    const colorClass = scheduleCategoryColors[upcomingEvent.category] || 'bg-gray-500';
    
    return (
      <div className="w-full max-w-lg mx-auto animate-slide-up px-4">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-80 h-80 rounded-full bg-primary/5 animate-breathe blur-3xl" />
        </div>

        <div className="bg-card rounded-3xl border border-border/40 shadow-lifted p-6 md:p-8 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: 'var(--gradient-focus)' }}
          />

          <div className="relative">
            {/* Icon Badge */}
            <div className="flex justify-center mb-6">
              <div className={`w-16 h-16 rounded-full ${colorClass} flex items-center justify-center animate-pulse`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                This is your most pressing task.
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight mb-4 text-balance text-center">
              You have {upcomingEvent.title} in {upcomingEvent.minutesUntil} {upcomingEvent.minutesUntil === 1 ? 'minute' : 'minutes'}
            </h2>
            
            <p className="text-sm text-muted-foreground/80 italic mb-6 text-center">
              "Scheduled from {upcomingEvent.startTime} to {upcomingEvent.endTime}"
            </p>

            <button
              onClick={onDismissEvent}
              className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-zen-sage-light hover:bg-primary/20 border border-primary/20 transition-all duration-300 w-full justify-center"
            >
              <span className="text-primary font-medium">Got It</span>
            </button>
            
            <p className="text-center text-xs text-muted-foreground/60 mt-4">
              Your next task will resume after this activity.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show regular task
  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up px-4">
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-80 h-80 rounded-full bg-primary/5 animate-breathe blur-3xl" />
      </div>

      <div className="bg-card rounded-3xl border border-border/40 shadow-lifted p-6 md:p-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: 'var(--gradient-focus)' }}
        />

        <div className="relative">
          {/* AI Suggestion Badge */}
          {focusSuggestion?.reason && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
              <Brain className="w-4 h-4 text-primary/70" />
              <p className="text-xs text-muted-foreground">{focusSuggestion.reason}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyColors[task.urgency]}`}>
              {urgencyLabels[task.urgency]}
            </span>
            
            {task.aiPowered && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight mb-4 text-balance">
            {task.title}
          </h2>
          
          {/* AI Insight */}
          {task.insight && (
            <p className="text-sm text-muted-foreground/80 italic mb-6">
              "{task.insight}"
            </p>
          )}

          <button
            onClick={() => onComplete(task.id)}
            className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-zen-sage-light hover:bg-primary/20 border border-primary/20 transition-all duration-300 w-full justify-center"
          >
            <div className="w-8 h-8 rounded-full border-2 border-primary/40 group-hover:border-primary group-hover:bg-primary flex items-center justify-center transition-all duration-300">
              <Check className="w-4 h-4 text-primary group-hover:text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-primary font-medium">Mark as done</span>
          </button>
          
          {/* Encouragement */}
          {focusSuggestion?.encouragement && (
            <p className="text-center text-xs text-muted-foreground/60 mt-4">
              {focusSuggestion.encouragement}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="w-full max-w-lg mx-auto text-center animate-fade-in px-4">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-64 h-64 rounded-full bg-zen-success/10 animate-breathe blur-3xl" />
        </div>

        <div className="bg-card/60 backdrop-blur rounded-3xl border border-border/30 p-8 md:p-12">
          <div className="w-16 h-16 rounded-2xl bg-zen-success/20 flex items-center justify-center mx-auto mb-6 animate-float">
            <Sparkles className="w-8 h-8 text-zen-success" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3">
            Your mind is clear
          </h2>
          <p className="text-muted-foreground font-light max-w-xs mx-auto">
            Nothing demands your attention right now. Enjoy this moment of calm.
          </p>
        </div>
      </div>
    </div>
  );
}


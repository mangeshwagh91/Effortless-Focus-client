import { Focus, Wind, List, Shuffle, Bell, Calendar } from 'lucide-react';

const modes = [
  { value: 'focus', icon: Focus, label: 'Focus' },
  { value: 'review', icon: List, label: 'Review' },
  { value: 'routine', icon: Calendar, label: 'Routine' },
  { value: 'decisions', icon: Shuffle, label: 'Decide' },
  { value: 'social', icon: Bell, label: 'Social' },
  { value: 'breathe', icon: Wind, label: 'Breathe' },
];
export function ModeToggle({ mode, onModeChange, hasTasks }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-card/60 backdrop-blur border border-border/30 max-w-full overflow-x-auto">
      {modes.map(({ value, icon: Icon, label }) => {
        const isActive = mode === value;
        const isDisabled = value === 'review' && !hasTasks;
        
        return (
          <button
            key={value}
            onClick={() => !isDisabled && onModeChange(value)}
            disabled={isDisabled}
            className={`
              flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-soft' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
              ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}


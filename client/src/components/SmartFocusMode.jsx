import { useState, useEffect } from 'react';
import { Play, Pause, Check, Clock, Brain, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function SmartFocusMode({ block, onComplete, onSkip, totalDuration }) {
  const [isActive, setIsActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const targetSeconds = (block?.duration || 30) * 60;
  const progressPercent = Math.min((elapsedSeconds / targetSeconds) * 100, 100);

  // Timer effect
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        // Auto-complete when time is up
        if (next >= targetSeconds) {
          setIsActive(false);
          handleComplete();
          return targetSeconds;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, targetSeconds]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleComplete = () => {
    const actualMinutes = Math.round(elapsedSeconds / 60);
    onComplete(actualMinutes);
    setIsActive(false);
    setElapsedSeconds(0);
  };

  const handleSkipBlock = () => {
    setIsActive(false);
    setElapsedSeconds(0);
    onSkip();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  if (!block) {
    return (
      <div className="w-full max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <Clock className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Active Block</h3>
        <p className="text-sm text-muted-foreground">
          Generate a plan from the Routine page to start
        </p>
      </div>
    );
  }

  const priorityColor = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-green-500',
  }[block.priority] || 'border-primary';

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-80 h-80 rounded-full bg-primary/5 animate-breathe blur-3xl" />
      </div>

      <div className={`bg-card rounded-3xl border-2 ${priorityColor} shadow-lifted p-8 relative overflow-hidden`}>
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: 'var(--gradient-focus)' }}
        />

        <div className="relative">
          {/* AI Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Brain className="w-3 h-3 mr-1" />
              AI Time Block
            </Badge>
            <Badge variant="outline" className="text-xs">
              {formatDuration(block.duration)}
            </Badge>
          </div>

          {/* Task Title */}
          <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight mb-3 text-center text-balance">
            {block.title}
          </h2>

          {/* Reason */}
          {block.reason && (
            <p className="text-sm text-muted-foreground italic mb-6 text-center">
              "{block.reason}"
            </p>
          )}

          {/* Timer Display */}
          <div className="my-8">
            {/* Progress Circle */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercent / 100)}`}
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-foreground">
                  {formatTime(isActive ? elapsedSeconds : 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  of {formatDuration(block.duration)}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {!isActive ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="w-full gap-2 text-lg py-6"
              >
                <Play className="w-5 h-5" />
                Start Focus Session
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="flex-1 gap-2"
                >
                  <Check className="w-5 h-5" />
                  Complete
                </Button>
              </div>
            )}

            <Button
              onClick={handleSkipBlock}
              variant="ghost"
              size="sm"
              className="w-full gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip to Next Block
            </Button>
          </div>

          {/* Progress Info */}
          <div className="mt-6 pt-6 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              {Math.round(progressPercent)}% complete • {formatTime(targetSeconds - elapsedSeconds)} remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

const phases = ['Breathe in', 'Hold', 'Breathe out', 'Hold'];
const phaseDurations = [4000, 2000, 4000, 2000];

export function BreatheMode() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const duration = phaseDurations[phaseIndex];
    
    if (phaseIndex === 0) setScale(1.3);
    else if (phaseIndex === 2) setScale(1);
    
    const timer = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [phaseIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="relative mb-12">
        <div 
          className="absolute inset-0 rounded-full bg-primary/20 blur-2xl transition-transform ease-in-out"
          style={{ transitionDuration: '4000ms', transform: `scale(${scale * 1.5})` }}
        />
        
        <div 
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center transition-transform ease-in-out"
          style={{ transitionDuration: '4000ms', transform: `scale(${scale})` }}
        >
          <div 
            className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center transition-transform ease-in-out"
            style={{ transitionDuration: '4000ms', transform: `scale(${1 / scale})` }}
          >
            <span className="text-primary font-serif text-xl md:text-2xl">
              {phases[phaseIndex]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {phases.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === phaseIndex
                ? 'bg-primary w-6'
                : 'bg-primary/20'
            }`}
          />
        ))}
      </div>

      <p className="mt-8 text-muted-foreground text-sm font-light">
        Take a moment. Your tasks will wait.
      </p>
    </div>
  );
}


import { useState, useRef, useEffect } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';

export function TaskInput({ onAdd, isAnalyzing = false, onAnalyze }) {
  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim() || isAnalyzing) return;

    // If onAnalyze is provided, use AI analysis
    if (onAnalyze) {
      const analysis = await onAnalyze(value.trim());
      setLastAnalysis(analysis);
      // Use the simplified title from AI analysis, or fall back to original input
      const taskTitle = analysis?.simplifiedTitle || value.trim();
      onAdd(taskTitle, analysis);
    } else {
      // Fallback to keyword-based urgency detection
      let urgency = 'soon';
      const lowerValue = value.toLowerCase();
      
      if (lowerValue.includes('urgent') || lowerValue.includes('asap') || lowerValue.includes('now')) {
        urgency = 'now';
      } else if (lowerValue.includes('later') || lowerValue.includes('someday') || lowerValue.includes('eventually')) {
        urgency = 'later';
      }

      onAdd(value, { urgency });
    }
    
    setValue('');
    setIsExpanded(false);
    
    // Clear analysis preview after a moment
    setTimeout(() => setLastAnalysis(null), 3000);
  };

  if (!isExpanded) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-lifted transition-all duration-300 w-full"
        >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Plus className="w-5 h-5 text-primary" />
        </div>
          <span className="text-muted-foreground font-light">Add something to focus on...</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto animate-fade-in px-4">
      <div className="bg-card rounded-2xl border border-border/50 shadow-lifted p-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => !value && setIsExpanded(false)}
          placeholder="What needs your attention?"
          className="w-full px-4 py-3 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 text-lg font-light"
          disabled={isAnalyzing}
        />
        <div className="flex items-center justify-between px-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 pl-2">
            <Sparkles className="w-3 h-3 text-primary/60" />
            <p className="text-xs text-muted-foreground/60">
              AI will understand your task's priority
            </p>
          </div>
          <button
            type="submit"
            disabled={!value.trim() || isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Add'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}


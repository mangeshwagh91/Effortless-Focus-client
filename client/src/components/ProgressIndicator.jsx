export function ProgressIndicator({ completed, pending }) {
  const total = completed + pending;
  
  if (total === 0) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-card/60 backdrop-blur border border-border/30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-zen-success/20 flex items-center justify-center">
          <span className="text-sm font-medium text-zen-success">{completed}</span>
        </div>
        <span className="text-xs text-muted-foreground">done today</span>
      </div>

      <div className="w-px h-6 bg-border/50" />

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">{pending}</span>
        </div>
        <span className="text-xs text-muted-foreground">remaining</span>
      </div>
    </div>
  );
}


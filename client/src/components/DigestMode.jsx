import { useState } from 'react';
import { Inbox, Check, Archive, Clock, Filter, Sparkles } from 'lucide-react';

const sampleItems = [
  {
    id: '1',
    type: 'article',
    title: 'The Art of Doing Less',
    source: 'Medium',
    summary: 'Simplicity is the ultimate sophistication. Focus on fewer things to achieve more meaningful results.',
    priority: 'high',
    readTime: '4 min',
  },
  {
    id: '2',
    type: 'email',
    title: 'Weekly Team Update',
    source: 'Work',
    summary: 'Project milestones on track. No action required from you.',
    priority: 'low',
    readTime: '1 min',
  },
  {
    id: '3',
    type: 'news',
    title: 'Tech Industry Trends 2026',
    source: 'Newsletter',
    summary: 'AI assistants focusing on reduction over addition. Calm tech gaining traction.',
    priority: 'medium',
    readTime: '6 min',
  },
];

const priorityColors = {
  high: 'bg-primary/20 text-primary',
  medium: 'bg-amber-500/20 text-amber-600',
  low: 'bg-muted text-muted-foreground',
};

const priorityLabels = {
  high: 'Read today',
  medium: 'This week',
  low: 'Skip or skim',
};

export function DigestMode() {
  const [items, setItems] = useState(sampleItems);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.priority === filter;
  });

  const archiveItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setExpandedId(null);
  };

  const markRead = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setExpandedId(null);
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-md animate-fade-in text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-display font-medium text-foreground mb-2">
          All caught up!
        </h2>
        <p className="text-sm text-muted-foreground">
          Your digest is clear. Enjoy the mental space.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-xl font-display font-medium text-foreground mb-2">
          Your curated digest
        </h2>
        <p className="text-sm text-muted-foreground">
          Pre-filtered and prioritized for you
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {['all', 'high', 'medium', 'low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? 'All' : priorityLabels[f]}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-card/60 backdrop-blur rounded-2xl border border-border/30 overflow-hidden transition-all"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${priorityColors[item.priority]}`}>
                      {priorityLabels[item.priority]}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readTime}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.source}</p>
                </div>
                <Inbox className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </div>

            {expandedId === item.id && (
              <div className="px-4 pb-4 animate-fade-in">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => archiveItem(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    Skip
                  </button>
                  <button
                    onClick={() => markRead(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/50">
        {items.length} items remaining · Oldest first
      </p>
    </div>
  );
}
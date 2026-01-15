import { useState, useEffect } from 'react';
import { Check, Trash2, Sparkles, Clock, Calendar, ArrowUpDown, GripVertical, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const urgencyColors = {
  now: 'border-l-red-500 bg-red-500/5',
  soon: 'border-l-yellow-500 bg-yellow-500/5',
  later: 'border-l-green-500 bg-green-500/5',
};

const urgencyLabels = {
  now: { text: 'Urgent', color: 'bg-red-500/10 text-red-600' },
  soon: { text: 'Soon', color: 'bg-yellow-500/10 text-yellow-600' },
  later: { text: 'Later', color: 'bg-green-500/10 text-green-600' },
};

export function TaskReview({ tasks, onComplete, onDelete, onClearCompleted, onReorderTasks }) {
  const [orderedTasks, setOrderedTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Sort tasks by urgency
  useEffect(() => {
  }, [tasks]);

  // Sort tasks for review
  useEffect(() => {
    const pending = tasks.filter(t => !t.completed);
    const sorted = [...pending].sort((a, b) => {
      if (a.priorityRank && b.priorityRank) {
        return a.priorityRank - b.priorityRank;
      }
      const urgencyOrder = { now: 0, soon: 1, later: 2 };
      return (urgencyOrder[a.urgency] || 1) - (urgencyOrder[b.urgency] || 1);
    });
    setOrderedTasks(sorted);
  }, [tasks]);

  const completed = tasks.filter(t => t.completed);

  // Drag and Drop handlers
  const handleDragStart = (e, task, index) => {
    setDraggedTask({ task, index });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.index === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const newTasks = [...orderedTasks];
    const [removed] = newTasks.splice(draggedTask.index, 1);
    newTasks.splice(dropIndex, 0, removed);
    
    // Update urgency based on new position
    const updatedTasks = newTasks.map((task, idx) => ({
      ...task,
      urgency: idx < 2 ? 'now' : idx < 5 ? 'soon' : 'later',
      priorityRank: idx + 1,
    }));
    
    setOrderedTasks(updatedTasks);
    setDragOverIndex(null);
    
    // Notify parent of new order
    if (onReorderTasks) {
      onReorderTasks(updatedTasks);
    }
  };

  // Format time for display (convert 24h to 12h format)
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Review & Prioritize</h2>
        <p className="text-sm text-muted-foreground">
          <ArrowUpDown className="w-3.5 h-3.5 inline-block mr-1" />
          Drag tasks to reorder and change priority
        </p>
      </div>

          {/* Draggable Tasks List */}
          {orderedTasks.length > 0 ? (
            <div className="space-y-2">
              {orderedTasks.map((task, index) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`
                    transition-all duration-200 cursor-grab active:cursor-grabbing
                    ${dragOverIndex === index ? 'transform scale-105' : ''}
                  `}
                >
                  <DraggableTaskRow 
                    task={task}
                    index={index}
                    onComplete={onComplete}
                    onDelete={onDelete}
                    isDragOver={dragOverIndex === index}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No tasks to review</h3>
              <p className="text-sm text-muted-foreground">
                Add tasks from the Focus page first
              </p>
            </div>
          )}

          {/* Completed Tasks */}
          {completed.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-border/40">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Completed Today ({completed.length})
                </h4>
                <button
                  onClick={onClearCompleted}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2 opacity-60">
                {completed.map(task => (
                  <div 
                    key={task.id}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/40"
                  >
                    <button
                      onClick={() => onComplete(task.id)}
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 bg-zen-success/20 border-zen-success"
                    >
                      <Check className="w-3 h-3 text-zen-success" />
                    </button>
                    <span className="flex-1 text-sm line-through text-muted-foreground">
                      {task.title}
                    </span>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-destructive/70" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
    </div>
  );
}

// Draggable Task Row Component
function DraggableTaskRow({ task, index, onComplete, onDelete, isDragOver }) {
  const urgency = task.urgency || 'soon';
  
  return (
    <div 
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl bg-card border-2 border-border/40 
        border-l-4 ${urgencyColors[urgency]} transition-all
        hover:shadow-soft select-none
        ${isDragOver ? 'border-primary border-dashed bg-primary/5' : ''}
      `}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Priority Number */}
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">
        {index + 1}
      </div>

      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete(task.id);
        }}
        className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all border-border hover:border-primary"
      >
        {task.completed && <Check className="w-3 h-3 text-zen-success" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-foreground font-medium">
          {task.title}
        </span>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <Badge variant="secondary" className={`text-xs ${urgencyLabels[urgency].color}`}>
            {urgencyLabels[urgency].text}
          </Badge>
          
          {task.category && (
            <Badge variant="secondary" className="text-xs capitalize">
              {task.category}
            </Badge>
          )}

          {task.estimatedMinutes && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.estimatedMinutes}min
            </span>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 transition-all"
      >
        <Trash2 className="w-4 h-4 text-destructive/70" />
      </button>
    </div>
  );
}


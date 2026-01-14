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

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai`;

export function TaskReview({ tasks, onComplete, onDelete, onClearCompleted, onReorderTasks }) {
  const [orderedTasks, setOrderedTasks] = useState([]);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Auto-prioritize tasks when they load
  useEffect(() => {
    const pending = tasks.filter(t => !t.completed);
    
    // If tasks don't have priorityRank, auto-prioritize them
    const needsPrioritization = pending.some(t => !t.priorityRank);
    
    if (needsPrioritization && pending.length > 0) {
      prioritizeTasksAuto(pending);
    } else {
      // Sort by existing priorityRank
      const sorted = [...pending].sort((a, b) => {
        if (a.priorityRank && b.priorityRank) {
          return a.priorityRank - b.priorityRank;
        }
        return 0;
      });
      setOrderedTasks(sorted);
    }
  }, [tasks]);

  const completed = tasks.filter(t => t.completed);

  // Auto-prioritize tasks using AI
  const prioritizeTasksAuto = async (tasksList) => {
    if (tasksList.length === 0) return;
    
    // Skip API call in demo mode - use simple sorting
    if (localStorage.getItem('demo_mode') === 'true') {
      const sorted = [...tasksList].sort((a, b) => {
        const urgencyOrder = { now: 0, soon: 1, later: 2 };
        return (urgencyOrder[a.urgency] || 1) - (urgencyOrder[b.urgency] || 1);
      });
      setOrderedTasks(sorted);
      if (onReorderTasks) {
        onReorderTasks(sorted);
      }
      return;
    }
    
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/prioritize-tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: tasksList }),
      });

      if (!response.ok) throw new Error('Failed to prioritize tasks');
      const result = await response.json();
      
      if (result.prioritizedTasks) {
        setOrderedTasks(result.prioritizedTasks);
        // Notify parent of new order
        if (onReorderTasks) {
          onReorderTasks(result.prioritizedTasks);
        }
      }
    } catch (error) {
      console.error('Auto-prioritization error:', error);
      // Fallback to simple sorting
      const sorted = [...tasksList].sort((a, b) => {
        const urgencyOrder = { now: 0, soon: 1, later: 2 };
        return (urgencyOrder[a.urgency] || 1) - (urgencyOrder[b.urgency] || 1);
      });
      setOrderedTasks(sorted);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, task, index) => {
    setDraggedTask({ task, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    // Add a slight delay to show drag effect
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

  // Format deadline for display
  const formatDeadline = (deadline, deadlineText) => {
    if (deadlineText) return deadlineText;
    if (!deadline) return null;
    
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      {orderedTasks.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">Task Priority</h2>
          <p className="text-sm text-muted-foreground mt-1">
            <Sparkles className="w-3.5 h-3.5 inline-block mr-1" />
            AI-organized by urgency — drag to reorder
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive px-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Empty State */}
      {orderedTasks.length === 0 && completed.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <ArrowUpDown className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No tasks to organize</h3>
          <p className="text-sm text-muted-foreground">
            Add tasks from the Focus page first
          </p>
        </div>
      )}

      {/* Draggable Tasks List */}
      {orderedTasks.length > 0 && (
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
                ${dragOverIndex === index ? 'transform translate-y-2' : ''}
              `}
            >
              <DraggableTaskRow 
                task={task}
                index={index}
                onComplete={onComplete}
                onDelete={onDelete}
                formatDeadline={formatDeadline}
                formatDuration={formatDuration}
                isDragOver={dragOverIndex === index}
              />
            </div>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-border/40">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Completed ({completed.length})
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
              <TaskRow 
                key={task.id} 
                task={task} 
                onComplete={onComplete}
                onDelete={onDelete}
                formatDeadline={formatDeadline}
                formatDuration={formatDuration}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Draggable Task Row with grip handle
function DraggableTaskRow({ task, index, onComplete, onDelete, formatDeadline, formatDuration, isDragOver }) {
  // Determine if task should be marked as urgent (deadline is today)
  const getDisplayUrgency = () => {
    if (task.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);
      
      // If deadline is today or past, mark as urgent
      if (taskDate.getTime() <= today.getTime()) {
        return 'now';
      }
    }
    
    // Check if deadlineText contains "today"
    if (task.deadlineText) {
      const lowerText = task.deadlineText.toLowerCase();
      if (lowerText.includes('today') || lowerText.includes('due today')) {
        return 'now';
      }
    }
    
    // Otherwise use the task's original urgency
    return task.urgency || 'soon';
  };
  
  const urgency = getDisplayUrgency();
  
  return (
    <div 
      className={`
        group flex items-center gap-2 px-3 py-3 rounded-xl bg-card border border-border/40 
        border-l-4 ${urgencyColors[urgency]} transition-all duration-200
        hover:shadow-soft select-none
        ${isDragOver ? 'border-primary border-2 border-dashed bg-primary/5' : ''}
      `}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Priority Number */}
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">
        {index + 1}
      </div>

      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete(task.id);
        }}
        className={`
          w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
          ${task.completed 
            ? 'bg-zen-success/20 border-zen-success' 
            : 'border-border hover:border-primary'
          }
        `}
      >
        {task.completed && <Check className="w-3 h-3 text-zen-success" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-foreground font-medium">
          {task.title}
        </span>
        
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {/* Urgency Badge */}
          <Badge variant="secondary" className={`text-xs px-1.5 py-0 ${urgencyLabels[urgency].color}`}>
            {urgencyLabels[urgency].text}
          </Badge>

          {/* Deadline */}
          {(task.deadline || task.deadlineText) && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDeadline(task.deadline, task.deadlineText)}
            </span>
          )}

          {/* Duration */}
          {task.estimatedMinutes && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(task.estimatedMinutes)}
            </span>
          )}
        </div>

        {/* AI Priority Reason */}
        {task.priorityReason && (
          <p className="text-xs text-muted-foreground mt-1 italic">
            💡 {task.priorityReason}
          </p>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 transition-all flex-shrink-0"
      >
        <Trash2 className="w-4 h-4 text-destructive/70" />
      </button>
    </div>
  );
}

// Simple Task Row for completed tasks
function TaskRow({ task, onComplete, onDelete, formatDeadline, formatDuration }) {
  return (
    <div 
      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/40 transition-all duration-200"
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
  );
}


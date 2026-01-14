import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ScheduleNotification({ event, onDismiss, onSnooze }) {
  if (!event) return null;

  const getCategoryColor = (category) => {
    const colors = {
      meal: 'bg-orange-500',
      exercise: 'bg-green-500',
      work: 'bg-blue-500',
      break: 'bg-purple-500',
      other: 'bg-gray-500'
    };
    return colors[category] || colors.other;
  };

  return (
    <AlertDialog open={!!event} onOpenChange={onDismiss}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-full ${getCategoryColor(event.category)}`}>
              <Clock className="h-6 w-6 text-white" />
            </div>
            <AlertDialogTitle className="text-xl">Upcoming Schedule</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-2">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">
                You have <span className="text-primary">{event.title}</span> in {event.minutesUntil} {event.minutesUntil === 1 ? 'minute' : 'minutes'}
              </p>
              <p className="text-sm text-muted-foreground">
                Scheduled from {event.startTime} to {event.endTime}
              </p>
              <p className="text-sm mt-4 text-foreground">
                Your next task will resume after this activity.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onSnooze}>
            Remind Later
          </Button>
          <Button onClick={onDismiss}>
            Got It
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

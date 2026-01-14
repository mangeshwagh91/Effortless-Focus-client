import { Leaf, Sparkles, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header({ aiContext, onShowAuth, onShowProfile }) {
  const { user, isAuthenticated, isDemoMode, logout } = useAuth();
  
  // Always use local time calculation for instant display
  const hour = new Date().getHours();
  const day = new Date().getDay();
  
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  
  // Use AI context message if available, otherwise show local contextual message
  let contextMessage = '';
  
  if (aiContext?.message) {
    contextMessage = aiContext.message;
  } else {
    // Instant local fallback messages
    if (hour >= 6 && hour < 12) {
      contextMessage = 'Morning is perfect for your most important work.';
    } else if (hour >= 12 && hour < 17) {
      contextMessage = 'A good time for collaboration and follow-ups.';
    } else if (hour >= 17 && hour < 22) {
      contextMessage = 'Wind down with lighter tasks.';
    }
    
    // Day-specific overrides
    if (day === 1) {
      contextMessage = 'Monday energy: Great for planning your week.';
    } else if (day === 5) {
      contextMessage = 'Friday: Perfect for clearing small tasks.';
    } else if (day === 0 || day === 6) {
      contextMessage = 'Weekend: Balance rest with personal goals.';
    }
  }

  return (
    <header className="flex flex-col items-center w-full max-w-lg mx-auto mb-8 animate-fade-in px-4">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-serif text-foreground whitespace-nowrap">Effortless Focus</h1>
            <p className="text-xs text-muted-foreground font-light">
              {greeting}{isAuthenticated && user ? `, ${user.name}` : ''}
            </p>
          </div>
        </div>

        <div>
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onShowProfile}>
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                {!isDemoMode && (
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={onShowAuth}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}


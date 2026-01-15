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
  const { user, isAuthenticated, logout } = useAuth();
  
  // Always use local time calculation for instant display
  const hour = new Date().getHours();
  const day = new Date().getDay();
  
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  
  // Use AI context message if available, otherwise don't show message
  let contextMessage = '';
  
  if (aiContext?.message) {
    contextMessage = aiContext.message;
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
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-muted-foreground cursor-not-allowed opacity-50"
                  disabled
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout (Demo Mode)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={onShowAuth}>
              Login
            </Button>
          )}
        </div>
      </div>
      
      {contextMessage && (
        <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 max-w-full">
          <Sparkles className="w-3 h-3 text-primary/70 flex-shrink-0" />
          <p className="text-xs text-muted-foreground text-center">{contextMessage}</p>
        </div>
      )}
    </header>
  );
}


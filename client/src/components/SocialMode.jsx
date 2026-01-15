import { useState, useEffect } from 'react';
import { Mail, Check, ExternalLink, RefreshCw, Bell, Inbox } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { demoEmails, isDemoMode } from '@/lib/demoData';

export function SocialMode() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [gmailAccessToken, setGmailAccessToken] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { isAuthenticated } = useAuth();

  const categoryLabels = {
    professional: { label: 'Professional', color: 'blue' },
    financial: { label: 'Financial', color: 'emerald' },
    promotional: { label: 'Promotions', color: 'purple' },
    social: { label: 'Social', color: 'green' },
    newsletter: { label: 'Newsletters', color: 'orange' },
    other: { label: 'Other', color: 'gray' }
  };

  const categoryOrder = ['professional', 'financial', 'promotional', 'social', 'newsletter', 'other'];

  // Group emails by category
  const emailsByCategory = emails.reduce((acc, email) => {
    const category = email.aiSummary?.category || email.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(email);
    return acc;
  }, {});

  const filteredEmails = selectedCategory === 'all' 
    ? emails 
    : emailsByCategory[selectedCategory] || [];

  // Load demo emails if in demo mode
  useEffect(() => {
    if (isDemoMode() && isAuthenticated) {
      setEmails(demoEmails);
      setUnreadCount(demoEmails.filter(e => !e.read).length);
      setGmailAccessToken('demo-token'); // Set a dummy token to skip the connect screen
      return;
    }
  }, [isAuthenticated]);

  // Check if user has connected Gmail
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear Gmail token if user is not authenticated
      localStorage.removeItem('gmailAccessToken');
      setGmailAccessToken(null);
      return;
    }

    // Capture access token from OAuth redirect URL hash
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        // Store token for this authenticated user
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          localStorage.setItem(`gmailAccessToken_${authToken}`, accessToken);
        }
        setGmailAccessToken(accessToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Fetch emails immediately
        fetchEmails(accessToken);
        return;
      }
    }
    
    // Check if token exists for current authenticated user
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const token = localStorage.getItem(`gmailAccessToken_${authToken}`);
      if (token) {
        setGmailAccessToken(token);
        fetchEmails(token);
      }
    }
  }, [isAuthenticated]);

  const fetchEmails = async (accessToken) => {
    if (!accessToken) {
      setError(null); // Don't show error if not connected yet
      return;
    }

    // Check if user is authenticated first
    const authToken = localStorage.getItem('authToken');
    if (!authToken || !isAuthenticated) {
      setError('Please log in to access Gmail integration.');
      setGmailAccessToken(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get login date (start of today if not stored)
      let loginDate = localStorage.getItem(`loginDate_${authToken}`);
      if (!loginDate) {
        // Store current date as login date
        loginDate = new Date().toISOString();
        localStorage.setItem(`loginDate_${authToken}`, loginDate);
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/gmail/unread`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          accessToken,
          sinceDate: loginDate // Only fetch emails from login date onwards
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Gmail API error:', response.status, data);
        
        // Handle 401 specifically
        if (response.status === 401) {
          // Clear invalid tokens
          localStorage.removeItem(`gmailAccessToken_${authToken}`);
          setGmailAccessToken(null);
          setError('Session expired. Please log in again.');
          return;
        }
        
        throw new Error(data.error || 'Failed to fetch emails');
      }

      setEmails(data.emails || []);
      setUnreadCount(data.count || 0);
      
      // Show warning if service is unavailable
      if (data.warning) {
        console.warn(data.warning);
      }
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Gmail integration unavailable. Continue using other features.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGmail = () => {
    // OAuth 2.0 flow for Gmail
    const clientId = import.meta.env.VITE_GMAIL_CLIENT_ID || 'YOUR_GMAIL_CLIENT_ID';
    const redirectUri = window.location.origin; // Should be http://localhost:8080
    const scope = 'https://www.googleapis.com/auth/gmail.readonly';
    
    console.log('OAuth Config:', { clientId, redirectUri, scope });
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=token` +
      `&scope=${scope}`;
    
    window.location.href = authUrl;
  };

  const handleRefresh = () => {
    if (gmailAccessToken) {
      fetchEmails(gmailAccessToken);
    }
  };

  const openEmail = (emailId) => {
    window.open(`https://mail.google.com/mail/u/0/#inbox/${emailId}`, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-center animate-fade-in">
        <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="text-2xl font-light mb-2">Social Notifications</h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to view your email notifications
        </p>
      </div>
    );
  }

  if (!gmailAccessToken) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-center animate-fade-in">
        <Mail className="w-16 h-16 mx-auto mb-4 text-primary/30" />
        <h2 className="text-2xl font-light mb-2">Connect Your Gmail</h2>
        <p className="text-muted-foreground mb-6">
          Get AI-powered summaries of your unread emails
        </p>
        <Button onClick={handleConnectGmail} className="gap-2">
          <Mail className="w-4 h-4" />
          Connect Gmail Account
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          We only read unread emails. Your data stays private.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-light">Social Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Category Filter */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          All ({emails.length})
        </button>
        {categoryOrder.map(category => {
          const categoryEmails = emailsByCategory[category];
          if (!categoryEmails || categoryEmails.length === 0) return null;
          
          const catInfo = categoryLabels[category] || categoryLabels.other;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {catInfo.label} ({categoryEmails.length})
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {loading && emails.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border border-border/50 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : emails.length === 0 ? (
        <div className="text-center py-12">
          <Inbox className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-lg font-light text-muted-foreground mb-2">
            Inbox Zero! 🎉
          </p>
          <p className="text-sm text-muted-foreground">
            You have no unread emails
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmails.map((email) => {
            const emailCategory = email.aiSummary?.category || email.category || 'other';
            const catInfo = categoryLabels[emailCategory] || categoryLabels.other;
            return (
              <div
                key={email.id}
                className="group p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-all hover:shadow-sm cursor-pointer"
                onClick={() => openEmail(email.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-${catInfo.color}-500/10 text-${catInfo.color}-600`}>
                        {catInfo.label}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm mb-1 truncate">
                      {email.subject || '(No Subject)'}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {email.from?.name || email.from}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
                
                <p className="text-sm text-muted-foreground/90 leading-relaxed mt-3">
                  {email.aiSummary?.summary || email.aiSummary || email.snippet}
                </p>

                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground/60">
                  <Mail className="w-3 h-3" />
                  <span>{new Date(email.date).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {emails.length > 0 && !isDemoMode() && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://mail.google.com', '_blank')}
            className="gap-2"
          >
            View All in Gmail
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

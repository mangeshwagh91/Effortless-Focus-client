import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Bell } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai`;

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastReadIndex, setLastReadIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hi! I\'m your AI focus assistant. Ask me anything about productivity, task management, or staying focused!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    }
  ]);

  // Count unread messages
  const unreadCount = messages.filter((msg, idx) => idx > lastReadIndex && msg.type === 'bot').length;

  // Get unread messages summary
  const getUnreadSummary = () => {
    const unreadMessages = messages.filter((msg, idx) => idx > lastReadIndex && msg.type === 'bot');
    if (unreadMessages.length === 0) return '';
    
    if (unreadMessages.length === 1) {
      return unreadMessages[0].text.substring(0, 100) + (unreadMessages[0].text.length > 100 ? '...' : '');
    }
    
    return `${unreadMessages.length} new messages: ${unreadMessages.map(m => m.text.substring(0, 30)).join(', ')}...`;
  };

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen) {
      setLastReadIndex(messages.length - 1);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    // Add user message
    const userMsg = {
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    const userMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      // Call AI chatbot endpoint
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          conversationHistory: messages.filter(m => m.type === 'user' || m.type === 'bot').slice(-6)
        }),
      });

      if (!response.ok) throw new Error('Chat failed');
      
      const data = await response.json();
      
      const botMsg = {
        type: 'bot',
        text: data.reply || data.message || 'I understand. How can I help you focus better?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Fallback response
      const fallbackResponses = {
        'help': "I can help you with:\n• Analyzing tasks and priorities\n• Suggesting what to focus on\n• Breaking down big tasks\n• Time management tips\n• Staying motivated",
        'focus': "Here's my focus tip: Work on ONE thing at a time. Our brains aren't built for multitasking. What's the most important task right now?",
        'productivity': "Productivity isn't about doing more—it's about doing what matters. Start with your hardest task when your energy is highest.",
        'break': "Taking breaks isn't lazy—it's strategic! Try the Pomodoro Technique: 25 min work, 5 min break. Your brain will thank you.",
        'default': "I'm here to help you stay focused and productive. Try asking about task priorities, time management, or breaking down complex projects!"
      };
      
      const msgLower = userMessage.toLowerCase();
      let reply = fallbackResponses.default;
      
      for (const [key, response] of Object.entries(fallbackResponses)) {
        if (msgLower.includes(key)) {
          reply = response;
          break;
        }
      }
      
      const botMsg = {
        type: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-card rounded-2xl shadow-2xl border border-border/40 flex flex-col z-50 animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-border/40 flex items-center justify-between bg-gradient-to-r from-zen-sage-light to-zen-success/10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zen-sage to-zen-success flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-zen-sage-dark" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Focus Assistant</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs opacity-60 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/40">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                placeholder="Ask me anything..."
                disabled={isTyping}
                className="flex-1 px-4 py-2 rounded-xl bg-muted border-none outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button with Notification Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="!fixed !bottom-6 !right-6 w-14 h-14 rounded-full bg-gradient-to-br from-zen-sage to-zen-success shadow-lifted hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 relative"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-zen-sage-dark" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-zen-sage-dark" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                {unreadCount}
              </div>
            )}
          </>
        )}
      </button>

      {/* Unread Messages Notification */}
      {!isOpen && unreadCount > 0 && (
        <div className="fixed bottom-24 right-6 max-w-xs bg-card border border-border shadow-xl rounded-xl p-4 z-40 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1">
                {unreadCount} Unread Message{unreadCount > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {getUnreadSummary()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

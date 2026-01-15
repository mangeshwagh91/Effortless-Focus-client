import { useState, useCallback } from 'react';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai`;

/**
 * Hook for AI-powered task analysis and focus suggestions
 */
export function useAI() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiContext, setAiContext] = useState(null);

  /**
   * Analyze a task using Grok AI
   */
  const analyzeTask = useCallback(async (taskText, existingTasks = []) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_BASE}/analyze-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskText, existingTasks }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI analysis error:', error);
      // Return fallback analysis
      return {
        success: true,
        urgency: 'soon',
        category: 'personal',
        estimatedMinutes: 30,
        simplifiedTitle: taskText.trim(),
        insight: 'One step at a time.',
        bestTimeOfDay: 'anytime',
        aiPowered: false,
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Get AI suggestion for which task to focus on
   */
  const getFocusSuggestion = useCallback(async (tasks, completedToday = 0) => {
    try {
      const response = await fetch(`${API_BASE}/focus-suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, completedToday }),
      });

      if (!response.ok) throw new Error('Suggestion failed');
      
      return await response.json();
    } catch (error) {
      console.error('AI suggestion error:', error);
      return null;
    }
  }, []);

  /**
   * Fetch current context (time of day, day of week, etc.)
   */
  const fetchContext = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/context`);
      if (!response.ok) throw new Error('Context fetch failed');
      
      const data = await response.json();
      setAiContext(data);
      return data;
    } catch (error) {
      console.error('Context fetch error:', error);
      // Fallback to local time context
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      let timeOfDay, greeting, message;
      if (hour >= 6 && hour < 12) {
        timeOfDay = 'morning';
        greeting = 'Good morning';
        message = 'Morning is perfect for important work.';
      } else if (hour >= 12 && hour < 17) {
        timeOfDay = 'afternoon';
        greeting = 'Good afternoon';
        message = 'A good time for follow-ups.';
      } else if (hour >= 17 && hour < 22) {
        timeOfDay = 'evening';
        greeting = 'Good evening';
        message = '';
      } else {
        timeOfDay = 'night';
        greeting = 'Hello';
        message = 'Rest is productive too.';
      }

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const fallbackContext = {
        timeOfDay,
        dayOfWeek: days[day],
        hour,
        isWeekend: day === 0 || day === 6,
        greeting,
        message,
      };
      
      setAiContext(fallbackContext);
      return fallbackContext;
    }
  }, []);

  return {
    analyzeTask,
    getFocusSuggestion,
    fetchContext,
    isAnalyzing,
    aiContext,
  };
}

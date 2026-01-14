// Demo data for prototype - Used when server is not available
// This allows the client prototype to work standalone

export const demoUser = {
  id: 'demo-user-001',
  email: 'raj.kumar@gmail.com',
  name: 'Raj Kumar',
  preferences: {
    theme: 'light',
    defaultView: 'focus',
    aiEnabled: true
  },
  stats: {
    totalTasksCompleted: 47,
    currentStreak: 5,
    longestStreak: 12
  },
  userProfile: {
    personal: {
      fullName: 'Rajesh Kumar',
      nickname: 'Raj',
      age: 26,
      gender: 'Male',
      pronouns: 'he/him'
    },
    professional: {
      occupation: 'Software Engineer',
      company: 'TCS India',
      fieldOfStudy: '',
      workHours: { start: '10:00', end: '19:00' },
      remoteWork: true,
      commute: { duration: 0, mode: 'remote' }
    },
    living: {
      type: 'apartment',
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        timezone: 'Asia/Kolkata'
      },
      hasPrivateSpace: true,
      quietHours: { start: '23:00', end: '08:00' }
    },
    routines: {
      wakeUpTime: '08:00',
      sleepTime: '00:30',
      mealTimes: { breakfast: '09:00', lunch: '13:30', dinner: '21:00' },
      exercise: {
        frequency: 4,
        preferredTime: 'evening',
        duration: 45,
        activities: ['gym', 'running', 'yoga']
      }
    },
    productivity: {
      chronotype: 'night_owl',
      peakHours: ['20:00-22:00', '10:00-12:00'],
      averageFocusDuration: 45,
      breakPreferences: { duration: 10, frequency: 45 },
      distractionTriggers: ['social_media', 'phone_notifications', 'open_office']
    },
    personality: {
      communicationStyle: 'direct',
      stressManagement: ['exercise', 'music', 'breaks'],
      decisionMaking: 'analytical',
      motivationType: 'achievement'
    }
  }
};

export const demoEmails = [
  {
    id: '1',
    from: {
      name: 'Priya Sharma',
      email: 'priya.sharma@tcs.com'
    },
    subject: 'Sprint Review Meeting - Friday 3 PM',
    snippet: 'Hi Raj, Just a reminder about our sprint review this Friday. Please prepare a quick demo of the authentication module you\'ve been working on...',
    body: `Hi Raj,

Just a reminder about our sprint review this Friday at 3 PM. 

Could you please prepare a quick demo of the authentication module you've been working on? The stakeholders are particularly interested in:
- The new OAuth integration
- Password reset flow
- Multi-factor authentication features

Let me know if you need any help preparing the presentation.

Best regards,
Priya Sharma
Team Lead - Engineering
TCS India`,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    starred: false,
    labels: ['work', 'meeting'],
    aiSummary: {
      summary: 'Meeting reminder for Friday sprint review at 3 PM. Action needed: Prepare demo of authentication module covering OAuth integration, password reset flow, and MFA features.',
      actionable: true,
      urgency: 'medium',
      category: 'work',
      keyPoints: [
        'Sprint review scheduled for Friday 3 PM',
        'Demo authentication module',
        'Cover OAuth, password reset, and MFA'
      ],
      suggestedTasks: [
        'Prepare demo for authentication module',
        'Test OAuth integration flow',
        'Test password reset functionality',
        'Test multi-factor authentication',
        'Create presentation slides with screenshots'
      ],
      estimatedReadTime: 2,
      sentiment: 'neutral',
      deadline: 'Friday 3 PM'
    }
  },
  {
    id: '2',
    from: {
      name: 'Amit Patel',
      email: 'amit.client@startupxyz.com'
    },
    subject: 'RE: Project Timeline Discussion - URGENT',
    snippet: 'Thanks for the update on the project. Could you clarify the deployment timeline? Our stakeholders are asking about the beta launch date...',
    body: `Hi Raj,

Thanks for the update on the project progress.

Could you please clarify the deployment timeline? Our stakeholders are asking specific questions about:

1. Beta launch date - when can we start testing with select users?
2. Production deployment - what's the estimated go-live date?
3. Any potential blockers we should be aware of?

This is somewhat urgent as we have a board meeting on Thursday and need to present the timeline.

Please respond by EOD tomorrow if possible.

Thanks,
Amit Patel
Product Manager
StartupXYZ`,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    read: false,
    starred: true,
    labels: ['work', 'client', 'urgent'],
    aiSummary: {
      summary: 'Urgent client request for project timeline clarification. Needs beta launch date, production deployment date, and potential blockers. Response required by EOD tomorrow for their board meeting.',
      actionable: true,
      urgency: 'high',
      category: 'work',
      keyPoints: [
        'Client needs timeline clarification urgently',
        'Board meeting on Thursday',
        'Response needed by EOD tomorrow',
        'Requires beta launch date, production date, and blockers'
      ],
      suggestedTasks: [
        'Review current project timeline with team',
        'Confirm beta launch date',
        'Identify production deployment date',
        'List any potential blockers',
        'Draft comprehensive response email',
        'Get approval from team lead before sending'
      ],
      estimatedReadTime: 3,
      sentiment: 'urgent',
      deadline: 'Tomorrow EOD',
      requiresResponse: true
    }
  },
  {
    id: '3',
    from: {
      name: 'Netflix India',
      email: 'no-reply@netflix.com'
    },
    subject: 'Your Netflix monthly subscription receipt',
    snippet: 'Thank you for being a Netflix member. Your subscription for ₹649 has been processed for this month...',
    body: `Dear Raj Kumar,

Thank you for being a Netflix member.

Your monthly subscription has been successfully processed.

Subscription Details:
- Plan: Premium (4 screens, Ultra HD)
- Amount: ₹649.00
- Payment Method: ****1234
- Next Billing Date: February 14, 2026

Continue enjoying unlimited movies, TV shows, and more.

If you have any questions, visit our Help Center.

— The Netflix Team`,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    read: true,
    starred: false,
    labels: ['receipts', 'entertainment'],
    aiSummary: {
      summary: 'Monthly Netflix subscription receipt for ₹649. Payment processed successfully. No action required.',
      actionable: false,
      urgency: 'low',
      category: 'finance',
      keyPoints: [
        'Netflix Premium subscription',
        'Amount: ₹649',
        'Next billing: February 14, 2026',
        'Payment successful'
      ],
      suggestedTasks: [],
      estimatedReadTime: 1,
      sentiment: 'informational',
      requiresResponse: false
    }
  },
  {
    id: '4',
    from: {
      name: 'Swiggy',
      email: 'noreply@swiggy.in'
    },
    subject: '🎉 Exclusive offer: 50% off on your next order!',
    snippet: 'Hey Raj! Craving something delicious? Use code SAVE50 and get 50% off on orders above ₹299. Valid till midnight tonight!',
    body: `Hey Raj!

Hungry? We've got an exclusive deal just for you! 🍕🍔

Get 50% OFF on your next order above ₹299
Use code: SAVE50

This offer is valid only till midnight tonight, so don't miss out!

✨ Popular restaurants near you:
- Burger King - 2.5 km
- Domino's Pizza - 1.8 km
- Wow! Momo - 3.2 km
- KFC - 2.1 km

Order now and enjoy delicious food delivered to your doorstep!

Happy eating,
Team Swiggy`,
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    read: true,
    starred: false,
    labels: ['promotions', 'food'],
    aiSummary: {
      summary: 'Promotional email from Swiggy offering 50% discount on orders above ₹299. Code: SAVE50. Valid until midnight tonight.',
      actionable: false,
      urgency: 'low',
      category: 'promotions',
      keyPoints: [
        '50% off on orders above ₹299',
        'Code: SAVE50',
        'Valid till midnight',
        'Promotional offer'
      ],
      suggestedTasks: [],
      estimatedReadTime: 1,
      sentiment: 'promotional',
      requiresResponse: false
    }
  },
  {
    id: '5',
    from: {
      name: 'Ananya Desai',
      email: 'ananya.desai@tcs.com'
    },
    subject: 'Team Lunch Tomorrow - Are you joining?',
    snippet: 'Hey everyone! We\'re planning a team lunch tomorrow at 1 PM at Mainland China. It\'s been a while since we all got together...',
    body: `Hey everyone!

We're planning a team lunch tomorrow (Wednesday) at 1 PM at Mainland China in Bandra.

It's been a while since we all got together outside of work meetings, and I think we deserve a nice break! 😊

The restaurant is about 10 minutes from the office. We have a reservation for 8 people, so please let me know by EOD today if you can make it.

Looking forward to seeing you all there!

Cheers,
Ananya Desai
Senior Developer
TCS India`,
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: false,
    starred: false,
    labels: ['social', 'team'],
    aiSummary: {
      summary: 'Team lunch invitation for tomorrow at 1 PM at Mainland China restaurant in Bandra. RSVP needed by EOD today.',
      actionable: true,
      urgency: 'medium',
      category: 'social',
      keyPoints: [
        'Team lunch tomorrow at 1 PM',
        'Location: Mainland China, Bandra',
        'RSVP by EOD today',
        '10 minutes from office'
      ],
      suggestedTasks: [
        'Respond to team lunch invitation',
        'Block calendar for tomorrow 1-2 PM if attending'
      ],
      estimatedReadTime: 2,
      sentiment: 'friendly',
      deadline: 'EOD today',
      requiresResponse: true
    }
  },
  {
    id: '6',
    from: {
      name: 'Amazon India',
      email: 'shipment-tracking@amazon.in'
    },
    subject: 'Your package will arrive tomorrow',
    snippet: 'Good news! Your package "Logitech MX Master 3 Wireless Mouse" is out for delivery and will arrive tomorrow between 10 AM - 2 PM...',
    body: `Hello Raj Kumar,

Good news! Your package is arriving soon.

Order Details:
- Item: Logitech MX Master 3 Wireless Mouse - Black
- Order Number: 402-8976432-1234567
- Estimated Delivery: Tomorrow, January 15, 2026
- Delivery Window: 10:00 AM - 2:00 PM

Your package is currently out for delivery from the Mumbai delivery station.

Tracking Status:
✓ Order placed - Jan 10
✓ Shipped - Jan 12
✓ Out for delivery - Today
→ Arriving tomorrow

You can track your package in real-time using the Amazon app.

Thank you for shopping with Amazon!

Best regards,
Amazon India`,
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    read: true,
    starred: false,
    labels: ['shopping', 'tracking'],
    aiSummary: {
      summary: 'Amazon package (Logitech MX Master 3 Mouse) arriving tomorrow between 10 AM - 2 PM. Currently out for delivery.',
      actionable: true,
      urgency: 'low',
      category: 'personal',
      keyPoints: [
        'Logitech MX Master 3 Mouse',
        'Delivery tomorrow 10 AM - 2 PM',
        'Currently out for delivery',
        'Order #402-8976432-1234567'
      ],
      suggestedTasks: [
        'Be available tomorrow 10 AM - 2 PM for package delivery'
      ],
      estimatedReadTime: 2,
      sentiment: 'informational',
      requiresResponse: false
    }
  }
];

export const demoTasks = [
  // Urgent tasks (now)
  {
    id: '1',
    title: 'Review pull request from team member',
    completed: false,
    urgency: 'now',
    category: 'work',
    estimatedMinutes: 30,
    insight: 'Quick review needed before EOD. Your focused morning hours are perfect for this.',
    bestTimeOfDay: 'morning',
    aiPowered: true,
    tags: ['code_review', 'urgent', 'team']
  },
  {
    id: '2',
    title: 'Respond to client email about project timeline',
    completed: false,
    urgency: 'now',
    category: 'work',
    estimatedMinutes: 15,
    insight: 'Time-sensitive communication. Address this before your lunch break.',
    bestTimeOfDay: 'morning',
    aiPowered: true,
    tags: ['email', 'client', 'urgent']
  },
  {
    id: '3',
    title: 'Book appointment for bike service',
    completed: false,
    urgency: 'now',
    category: 'personal',
    estimatedMinutes: 10,
    insight: 'Quick call during a short break. Don\'t let this slip!',
    bestTimeOfDay: 'anytime',
    aiPowered: true,
    tags: ['phone_call', 'vehicle']
  },
  
  // Soon tasks
  {
    id: '4',
    title: 'Complete AWS Solutions Architect module 3',
    completed: false,
    urgency: 'soon',
    category: 'learning',
    estimatedMinutes: 90,
    insight: 'Allocate your peak evening hours (8-10 PM) for deep learning. You\'re close to your certification goal!',
    bestTimeOfDay: 'evening',
    aiPowered: true,
    tags: ['aws', 'certification', 'learning']
  },
  {
    id: '5',
    title: 'Prepare presentation for Friday\'s sprint review',
    completed: false,
    urgency: 'soon',
    category: 'work',
    estimatedMinutes: 60,
    insight: 'Break this into smaller chunks: outline (15 min), slides (30 min), practice (15 min).',
    bestTimeOfDay: 'afternoon',
    aiPowered: true,
    tags: ['presentation', 'work', 'meeting']
  },
  {
    id: '6',
    title: 'Update project documentation',
    completed: false,
    urgency: 'soon',
    category: 'work',
    estimatedMinutes: 45,
    insight: 'Document while the implementation is fresh in your mind. Perfect for post-lunch focus.',
    bestTimeOfDay: 'afternoon',
    aiPowered: true,
    tags: ['documentation', 'work']
  },
  {
    id: '7',
    title: 'Buy groceries for the week',
    completed: false,
    urgency: 'soon',
    category: 'personal',
    estimatedMinutes: 60,
    insight: 'Weekend morning would be ideal. Make a list beforehand to save time.',
    bestTimeOfDay: 'morning',
    aiPowered: true,
    tags: ['shopping', 'groceries']
  },
  {
    id: '8',
    title: 'Call parents',
    completed: false,
    urgency: 'soon',
    category: 'personal',
    estimatedMinutes: 30,
    insight: 'Evening after dinner is your usual family time. Perfect for a relaxed conversation.',
    bestTimeOfDay: 'evening',
    aiPowered: true,
    tags: ['family', 'phone_call']
  },
  
  // Later tasks
  {
    id: '9',
    title: 'Research new frontend frameworks for side project',
    completed: false,
    urgency: 'later',
    category: 'learning',
    estimatedMinutes: 60,
    insight: 'This aligns with your learning goals. Schedule for weekend deep work session.',
    bestTimeOfDay: 'afternoon',
    aiPowered: true,
    tags: ['research', 'side_project', 'learning']
  },
  {
    id: '10',
    title: 'Plan weekend trip to Goa',
    completed: false,
    urgency: 'later',
    category: 'personal',
    estimatedMinutes: 45,
    insight: 'Fun planning activity! Perfect for a relaxed evening when you want a mental break.',
    bestTimeOfDay: 'evening',
    aiPowered: true,
    tags: ['travel', 'planning', 'fun']
  }
];

// Helper function to load demo data into localStorage
export const loadDemoData = () => {
  if (typeof window === 'undefined') return;
  
  // Store demo emails
  localStorage.setItem('demo_emails', JSON.stringify(demoEmails));
  localStorage.setItem('demo_tasks', JSON.stringify(demoTasks));
  localStorage.setItem('demo_user', JSON.stringify(demoUser));
  
  console.log('✅ Demo data loaded into localStorage');
};

// Helper function to check if demo mode is active
export const isDemoMode = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('demo_mode') === 'true';
};

// Helper function to enable demo mode
export const enableDemoMode = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('demo_mode', 'true');
  loadDemoData();
};

// Helper function to disable demo mode
export const disableDemoMode = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('demo_mode');
  localStorage.removeItem('demo_emails');
  localStorage.removeItem('demo_tasks');
  localStorage.removeItem('demo_user');
};

// Get demo emails (for use in components)
export const getDemoEmails = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('demo_emails');
  return stored ? JSON.parse(stored) : demoEmails;
};

// Get demo tasks (for use in components)
export const getDemoTasks = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('demo_tasks');
  return stored ? JSON.parse(stored) : demoTasks;
};

// Get demo user (for use in components)
export const getDemoUser = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('demo_user');
  return stored ? JSON.parse(stored) : demoUser;
};

/**
 * DEMO DATA FOR EFFORTLESS FOCUS
 * 
 * This file contains comprehensive demo data for evaluation/judging purposes.
 * 
 * IMPORTANT: User is ALWAYS logged in for demo mode. Logout is DISABLED.
 * 
 * Demo data includes:
 * - User profile (Raj Kumar - Senior Software Engineer at TCS India)
 * - User stats, preferences, and detailed profile information
 * - 12 tasks (urgent, soon, and later categories)
 * - 7 emails with AI summaries (work, personal, notifications)
 * - 6 routines (work, learning, health, personal)
 * - All data is automatically loaded on app initialization
 * 
 * The demo mode is automatically enabled and persisted in localStorage.
 * Judges cannot log out to ensure consistent evaluation experience.
 */

// Demo data for prototype - Used when server is not available
// This allows the client prototype to work standalone
// User is always logged in for demo/judging purposes

export const demoUser = {
  id: 'demo-user-001',
  email: 'raj.kumar@gmail.com',
  name: 'Raj Kumar',
  preferences: {
    theme: 'light',
    defaultView: 'focus',
    aiEnabled: true,
    notificationsEnabled: true,
    emailDigestEnabled: true,
    soundEnabled: false
  },
  stats: {
    totalTasksCompleted: 147,
    currentStreak: 12,
    longestStreak: 23,
    totalFocusMinutes: 4320,
    completedToday: 5,
    weeklyGoal: 30,
    weeklyProgress: 18
  },
  userProfile: {
    personal: {
      fullName: 'Rajesh Kumar',
      nickname: 'Raj',
      age: 26,
      gender: 'male',
      dateOfBirth: '1999-08-15',
      phoneNumber: '+91 98765 43210'
    },
    professional: {
      occupation: 'Senior Software Engineer',
      company: 'TCS India',
      department: 'Engineering - Cloud Solutions',
      workEmail: 'rajesh.kumar@tcs.com',
      yearsOfExperience: 5,
      currentProjects: ['AWS Migration', 'OAuth Integration', 'Team Mentoring']
    },
    living: {
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        timezone: 'Asia/Kolkata',
        address: 'Andheri West, Mumbai 400058'
      },
      livingArrangement: 'Apartment',
      commute: '30 minutes by metro'
    },
    productivity: {
      chronotype: 'night_owl',
      peakHours: ['20:00-22:00', '10:00-12:00'],
      focusStyle: 'deep_work_blocks',
      preferredBreakActivity: 'short_walk',
      energyLevel: {
        morning: 'medium',
        afternoon: 'high',
        evening: 'very_high'
      },
      distractions: ['social_media', 'notifications', 'meetings']
    },
    goals: {
      professional: [
        'Complete AWS Solutions Architect certification by March',
        'Lead migration project successfully',
        'Mentor 2 junior developers'
      ],
      personal: [
        'Maintain work-life balance',
        'Exercise 4 times per week',
        'Read 2 books per month'
      ],
      learning: [
        'Master Kubernetes',
        'Learn System Design patterns',
        'Improve public speaking skills'
      ]
    },
    interests: ['Cloud Computing', 'Photography', 'Cricket', 'Travel', 'Tech Blogs'],
    habits: {
      morning: ['Check emails', 'Morning walk', 'Plan the day'],
      evening: ['Code review', 'Learning time', 'Exercise'],
      weekend: ['Side projects', 'Family time', 'Photography']
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
      name: 'Ananya Desai',
      email: 'ananya.desai@tcs.com'
    },
    subject: 'Kubernetes Workshop - Next Tuesday',
    snippet: 'Hey Raj! Excited to see you signed up for the Kubernetes workshop. Here are the pre-workshop materials...',
    body: `Hey Raj!

Excited to see you signed up for the Kubernetes workshop next Tuesday!

Here are some things to prepare:
- Install kubectl and minikube on your machine
- Review the basics of containerization (if needed)
- Come with questions - this is a hands-on session!

Workshop Details:
Date: Tuesday, Jan 21, 2026
Time: 2:00 PM - 5:00 PM
Location: Conference Room B / Virtual Link: teams.link/workshop

Looking forward to it!

Ananya Desai
DevOps Lead`,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    starred: true,
    labels: ['work', 'learning', 'event'],
    aiSummary: {
      summary: 'Kubernetes workshop next Tuesday 2-5 PM. Preparation needed: Install kubectl and minikube, review containerization basics.',
      actionable: true,
      urgency: 'medium',
      category: 'learning',
      keyPoints: [
        'Workshop on Tuesday Jan 21, 2-5 PM',
        'Install kubectl and minikube',
        'Review containerization basics',
        'Hands-on session'
      ],
      suggestedTasks: [
        'Install kubectl on local machine',
        'Install minikube',
        'Review Docker/containerization concepts',
        'Prepare questions for workshop',
        'Add workshop to calendar'
      ],
      estimatedReadTime: 2,
      sentiment: 'positive',
      deadline: 'Tuesday Jan 21'
    }
  },
  {
    id: '5',
    from: {
      name: 'Mom',
      email: 'rashmi.kumar@gmail.com'
    },
    subject: 'Republic Day plans?',
    snippet: 'Beta, we were thinking of having everyone over for Republic Day. Will you be able to make it home?...',
    body: `Beta,

We were thinking of having everyone over for Republic Day. Will you be able to make it home?

Your dad really wants to see you, and your cousin Priya is also coming from Delhi with her family.

Let us know soon so we can plan accordingly!

Love,
Mom`,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    starred: true,
    labels: ['personal', 'family'],
    aiSummary: {
      summary: 'Family gathering for Republic Day. Mom asking if you can attend. Needs confirmation for planning.',
      actionable: true,
      urgency: 'medium',
      category: 'personal',
      keyPoints: [
        'Family gathering on Republic Day',
        'Multiple family members attending',
        'Need to confirm attendance',
        'Dad wants to see you'
      ],
      suggestedTasks: [
        'Check work schedule for Republic Day',
        'Book train/flight tickets if attending',
        'Reply to mom with confirmation',
        'Plan travel logistics'
      ],
      estimatedReadTime: 1,
      sentiment: 'warm',
      deadline: 'Soon - planning needed',
      requiresResponse: true
    }
  },
  {
    id: '6',
    from: {
      name: 'GitHub',
      email: 'noreply@github.com'
    },
    subject: 'Your pull request was merged',
    snippet: 'Pull request #234 was merged into main by priya-sharma...',
    body: `Hi @rajkumar,

Your pull request #234 "Implement OAuth2.0 authentication flow" was merged into main by @priya-sharma.

View the pull request:
https://github.com/tcs-cloud/auth-service/pull/234

This notification was sent to you because you are subscribed to this repository.

Reply to this email directly or view it on GitHub.`,
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    starred: false,
    labels: ['work', 'github', 'notifications'],
    aiSummary: {
      summary: 'Your OAuth2.0 authentication PR was merged. No action required.',
      actionable: false,
      urgency: 'low',
      category: 'work',
      keyPoints: [
        'PR #234 merged to main',
        'OAuth2.0 implementation complete',
        'Merged by team lead'
      ],
      suggestedTasks: [],
      estimatedReadTime: 1,
      sentiment: 'positive',
      requiresResponse: false
    }
  },
  {
    id: '7',
    from: {
      name: 'LinkedIn Learning',
      email: 'learning@linkedin.com'
    },
    subject: 'New course recommendation: System Design Fundamentals',
    snippet: 'Based on your learning history, you might enjoy "System Design Fundamentals" by Alex Xu...',
    body: `Hi Raj,

Based on your learning history and interests, we think you'd enjoy:

**System Design Fundamentals**
By Alex Xu
★★★★★ 4.8 (12,450 ratings)
Duration: 6 hours 30 minutes

This course covers:
- Scalability principles
- Database design patterns
- Microservices architecture
- System design interview prep

Continue your learning journey today!

[Start Learning]

Best,
LinkedIn Learning Team`,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    starred: false,
    labels: ['learning', 'recommendations'],
    aiSummary: {
      summary: 'Course recommendation for System Design Fundamentals. Relevant to your learning goals.',
      actionable: false,
      urgency: 'low',
      category: 'learning',
      keyPoints: [
        'System Design course by Alex Xu',
        'Covers scalability and microservices',
        'Highly rated (4.8/5)',
        '6.5 hours duration'
      ],
      suggestedTasks: [],
      estimatedReadTime: 1,
      sentiment: 'informational',
      requiresResponse: false
    }
  },
  {
    id: '8',
    from: {
      name: 'Rahul Verma',
      email: 'rahul.verma23@gmail.com'
    },
    subject: 'Weekend Cricket Match - Are you in?',
    snippet: 'Hey Raj! We\'re organizing a cricket match this Sunday at Goregaon Sports Complex. Need one more player...',
    body: `Hey Raj!

We're organizing a cricket match this Sunday at Goregaon Sports Complex around 7 AM. Need one more player for our team!

It's been a while since we played together. Rohan, Karthik, and the usual gang will be there. After the match, we're planning to grab breakfast at that new café near the complex.

Let me know by tonight if you can make it!

Cheers,
Rahul`,
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    read: false,
    starred: false,
    labels: ['social', 'friends', 'sports'],
    aiSummary: {
      summary: 'Friend inviting you to cricket match this Sunday at 7 AM. Need confirmation tonight.',
      actionable: true,
      urgency: 'medium',
      category: 'social',
      keyPoints: [
        'Cricket match Sunday 7 AM',
        'Goregaon Sports Complex',
        'Breakfast plans after match',
        'Need response by tonight'
      ],
      suggestedTasks: [
        'Check Sunday morning availability',
        'Confirm attendance with Rahul',
        'Prepare cricket gear if attending'
      ],
      estimatedReadTime: 1,
      sentiment: 'friendly',
      deadline: 'Tonight',
      requiresResponse: true
    }
  },
  {
    id: '9',
    from: {
      name: 'Sneha Iyer',
      email: 'sneha.iyer@gmail.com'
    },
    subject: 'Photography Walk - Gateway of India',
    snippet: 'Hi Raj! Remember you mentioned wanting to improve your photography? I\'m organizing a sunrise photo walk...',
    body: `Hi Raj!

Remember you mentioned wanting to improve your photography? I'm organizing a sunrise photo walk at Gateway of India this Saturday at 5:30 AM!

We'll cover:
- Golden hour photography
- Composition techniques
- Street photography tips
- Post-processing basics

It's a small group of 6 people, all photography enthusiasts. Bring your camera/phone and let's capture some amazing shots!

Interested? Drop me a message!

Sneha
Mumbai Photography Club`,
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    read: false,
    starred: true,
    labels: ['social', 'hobby', 'photography'],
    aiSummary: {
      summary: 'Photography walk invitation for Saturday 5:30 AM at Gateway of India. Covers golden hour and street photography techniques.',
      actionable: true,
      urgency: 'medium',
      category: 'social',
      keyPoints: [
        'Saturday morning 5:30 AM',
        'Gateway of India location',
        'Photography techniques workshop',
        'Small group of 6 people'
      ],
      suggestedTasks: [
        'Check camera equipment',
        'Confirm attendance with Sneha',
        'Plan early morning transportation',
        'Review basic photography concepts'
      ],
      estimatedReadTime: 1,
      sentiment: 'enthusiastic',
      deadline: 'Soon - Saturday morning',
      requiresResponse: true
    }
  },
  {
    id: '10',
    from: {
      name: 'Kavya Reddy',
      email: 'kavya.reddy@gmail.com'
    },
    subject: 'Birthday Party Invitation! 🎉',
    snippet: 'You\'re invited to my birthday celebration next Saturday! It\'s going to be a fun evening with dinner and games...',
    body: `Hey Raj!

You're invited to my birthday celebration next Saturday, January 25th!

Party Details:
📍 Location: My apartment, Bandra West
🕖 Time: 7:00 PM onwards
🍽️ Dinner, music, and board games!

Dress code: Casual
RSVP by Wednesday so I can plan food accordingly.

Really hope you can make it! It's been ages since we all got together.

Excited to see you!
Kavya 🎂`,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: false,
    starred: true,
    labels: ['social', 'friends', 'event'],
    aiSummary: {
      summary: 'Birthday party invitation for January 25th at 7 PM in Bandra. RSVP needed by Wednesday.',
      actionable: true,
      urgency: 'medium',
      category: 'social',
      keyPoints: [
        'Birthday party on January 25th',
        'Location: Bandra West, 7 PM',
        'Dinner and board games',
        'RSVP required by Wednesday'
      ],
      suggestedTasks: [
        'Check calendar for January 25th evening',
        'RSVP to Kavya by Wednesday',
        'Buy birthday gift',
        'Plan transportation to Bandra'
      ],
      estimatedReadTime: 1,
      sentiment: 'excited',
      deadline: 'Wednesday for RSVP',
      requiresResponse: true
    }
  },
  {
    id: '11',
    from: {
      name: 'TCS Book Club',
      email: 'bookclub@tcs.com'
    },
    subject: 'February Book Selection: "The Phoenix Project"',
    snippet: 'Great news! Our book club has selected "The Phoenix Project" for February. First discussion on Feb 7th...',
    body: `Hi Book Club Members!

Great news! Our book club has selected "The Phoenix Project" by Gene Kim for February's reading.

📚 Book: The Phoenix Project - A Novel about IT, DevOps, and Helping Your Business Win
👥 First Discussion: Friday, February 7th at 4 PM
📍 Location: Office Cafeteria / Teams Link

This book is perfect for us tech folks - it's about IT transformations and DevOps practices told through an engaging story.

Please get your copy and aim to read at least the first 5 chapters before our first meeting.

Looking forward to great discussions!

Priya
TCS Book Club Coordinator`,
    date: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(), // 15 hours ago
    read: false,
    starred: false,
    labels: ['social', 'work', 'book-club'],
    aiSummary: {
      summary: 'Book club selected "The Phoenix Project" for February. First discussion on Feb 7th at 4 PM. Need to read first 5 chapters.',
      actionable: true,
      urgency: 'low',
      category: 'social',
      keyPoints: [
        'Book: The Phoenix Project',
        'First meeting Feb 7th at 4 PM',
        'Read first 5 chapters before meeting',
        'Office/virtual attendance'
      ],
      suggestedTasks: [
        'Order/download "The Phoenix Project"',
        'Add reading time to weekly schedule',
        'Mark Feb 7th discussion in calendar',
        'Read first 5 chapters'
      ],
      estimatedReadTime: 2,
      sentiment: 'informational',
      deadline: 'Feb 7th',
      requiresResponse: false
    }
  },
  {
    id: '12',
    from: {
      name: 'Meetup.com',
      email: 'notifications@meetup.com'
    },
    subject: 'Upcoming: Mumbai Tech Meetup - Cloud Native Architecture',
    snippet: 'You\'re registered for "Cloud Native Architecture Patterns" happening tomorrow at 6:30 PM...',
    body: `Hi Raj,

You're registered for the Mumbai Tech Meetup event happening tomorrow!

📅 Event: Cloud Native Architecture Patterns
🕡 Time: Tomorrow, 6:30 PM - 9:00 PM
📍 Venue: WeWork, Lower Parel
💡 Topics: Kubernetes, Microservices, Service Mesh

Speaker: Vikram Sharma (Cloud Architect at Microsoft Azure)

What to expect:
- Deep dive into K8s patterns
- Real-world case studies
- Networking session
- Free pizza & drinks!

Don't forget to bring your ID for venue entry.

See you there!
Mumbai Tech Community`,
    date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    read: false,
    starred: true,
    labels: ['social', 'tech', 'meetup', 'professional'],
    aiSummary: {
      summary: 'Tech meetup tomorrow at 6:30 PM on Cloud Native Architecture. Location: WeWork Lower Parel. Bring ID for entry.',
      actionable: true,
      urgency: 'high',
      category: 'professional',
      keyPoints: [
        'Tomorrow 6:30 PM at WeWork',
        'Topic: Cloud Native Architecture',
        'Speaker from Microsoft Azure',
        'Bring ID for venue entry'
      ],
      suggestedTasks: [
        'Add meetup to calendar',
        'Plan to leave office by 6 PM',
        'Prepare questions on K8s',
        'Remember to bring ID',
        'Review Cloud Native basics'
      ],
      estimatedReadTime: 2,
      sentiment: 'informational',
      deadline: 'Tomorrow 6:30 PM',
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
    tags: ['code_review', 'urgent', 'team'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
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
    tags: ['email', 'client', 'urgent'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
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
    tags: ['aws', 'certification', 'learning'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
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
    tags: ['research', 'side_project', 'learning'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Demo routines data
export const demoRoutines = [
  {
    id: 'routine-1',
    title: 'AWS Certification Study',
    priority: 'high',
    frequency: 5,
    category: 'learning',
    mentalLoad: 'heavy',
    preferredTimeOfDay: 'evening',
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    avgCompletionMinutes: 75,
    completionRate: 0.85,
    lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description: 'Study for AWS Solutions Architect certification',
    estimatedMinutes: 90
  },
  {
    id: 'routine-2',
    title: 'Code Review & Mentoring',
    priority: 'high',
    frequency: 5,
    category: 'work',
    mentalLoad: 'medium',
    preferredTimeOfDay: 'morning',
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    avgCompletionMinutes: 45,
    completionRate: 0.92,
    lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description: 'Review team PRs and mentor junior developers',
    estimatedMinutes: 60
  },
  {
    id: 'routine-3',
    title: 'Evening Workout',
    priority: 'medium',
    frequency: 4,
    category: 'health',
    mentalLoad: 'light',
    preferredTimeOfDay: 'evening',
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    avgCompletionMinutes: 35,
    completionRate: 0.78,
    lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Gym workout or home exercise routine',
    estimatedMinutes: 45
  },
  {
    id: 'routine-4',
    title: 'Side Project Development',
    priority: 'medium',
    frequency: 3,
    category: 'personal',
    mentalLoad: 'heavy',
    preferredTimeOfDay: 'weekend',
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    avgCompletionMinutes: 120,
    completionRate: 0.65,
    lastCompleted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Work on personal web app project',
    estimatedMinutes: 120
  },
  {
    id: 'routine-5',
    title: 'Tech Blog Reading',
    priority: 'low',
    frequency: 7,
    category: 'learning',
    mentalLoad: 'light',
    preferredTimeOfDay: 'anytime',
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    avgCompletionMinutes: 20,
    completionRate: 0.88,
    lastCompleted: new Date().toISOString(),
    description: 'Stay updated with latest tech trends',
    estimatedMinutes: 30
  },
  {
    id: 'routine-6',
    title: 'Weekly Planning Session',
    priority: 'high',
    frequency: 1,
    category: 'productivity',
    mentalLoad: 'medium',
    preferredTimeOfDay: 'weekend',
    isActive: true,
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    avgCompletionMinutes: 45,
    completionRate: 0.95,
    lastCompleted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Plan goals and tasks for the upcoming week',
    estimatedMinutes: 60
  }
];

// Daily schedule with fixed routines (morning routine, meals, breaks, etc.)
export const demoDailySchedule = [
  {
    id: 'schedule-1',
    title: 'Wake Up & Morning Routine',
    startTime: '07:00',
    endTime: '07:30',
    category: 'personal',
    type: 'routine',
    isFixed: true,
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  },
  {
    id: 'schedule-2',
    title: 'Breakfast',
    startTime: '07:30',
    endTime: '08:00',
    category: 'personal',
    type: 'meal',
    isFixed: true,
    daysOfWeek: [1, 2, 3, 4, 5]
  },
  {
    id: 'schedule-3',
    title: 'Commute to Office',
    startTime: '08:00',
    endTime: '08:30',
    category: 'personal',
    type: 'routine',
    isFixed: true,
    daysOfWeek: [1, 2, 3, 4, 5]
  },
  {
    id: 'schedule-4',
    title: 'Morning Coffee Break',
    startTime: '10:30',
    endTime: '10:45',
    category: 'break',
    type: 'break',
    isFixed: true,
    daysOfWeek: [1, 2, 3, 4, 5]
  },
  {
    id: 'schedule-5',
    title: 'Lunch Break',
    startTime: '12:30',
    endTime: '13:30',
    category: 'meal',
    type: 'meal',
    isFixed: true,
    daysOfWeek: [1, 2, 3, 4, 5]
  },
  {
    id: 'schedule-6',
    title: 'Afternoon Tea Break',
    startTime: '15:30',
    endTime: '15:45',
    category: 'break',
    type: 'break',
    isFixed: true,
    daysOfWeek: [1, 2, 3, 4, 5]
  },
  {
    id: 'schedule-7',
    title: 'Commute from Office',
    startTime: '17:30',
    endTime: '18:00',
    category: 'personal',
    type: 'routine',
    isFixed: true,
    daysOfWeek: [1, 2, 3, 4, 5]
  },
  {
    id: 'schedule-8',
    title: 'Dinner',
    startTime: '19:30',
    endTime: '20:30',
    category: 'meal',
    type: 'meal',
    isFixed: true,
    daysOfWeek: [1, 2, 3, 4, 5]
  },
  {
    id: 'schedule-9',
    title: 'Evening Wind Down',
    startTime: '22:30',
    endTime: '23:00',
    category: 'personal',
    type: 'routine',
    isFixed: true,
    daysOfWeek: [1, 2, 3, 4, 5]
  },
  // Weekend schedule
  {
    id: 'schedule-weekend-1',
    title: 'Wake Up',
    startTime: '08:00',
    endTime: '08:30',
    category: 'personal',
    type: 'routine',
    isFixed: true,
    daysOfWeek: [0, 6] // Sunday and Saturday
  },
  {
    id: 'schedule-weekend-2',
    title: 'Brunch',
    startTime: '10:00',
    endTime: '11:00',
    category: 'meal',
    type: 'meal',
    isFixed: true,
    daysOfWeek: [0, 6]
  },
  {
    id: 'schedule-weekend-3',
    title: 'Lunch',
    startTime: '13:30',
    endTime: '14:30',
    category: 'meal',
    type: 'meal',
    isFixed: true,
    daysOfWeek: [0, 6]
  },
  {
    id: 'schedule-weekend-4',
    title: 'Dinner',
    startTime: '20:00',
    endTime: '21:00',
    category: 'meal',
    type: 'meal',
    isFixed: true,
    daysOfWeek: [0, 6]
  }
];

// Helper function to load demo data into localStorage
export const loadDemoData = () => {
  if (typeof window === 'undefined') return;
  
  // Store demo emails
  localStorage.setItem('demo_emails', JSON.stringify(demoEmails));
  localStorage.setItem('demo_tasks', JSON.stringify(demoTasks));
  localStorage.setItem('demo_user', JSON.stringify(demoUser));
  localStorage.setItem('demo_routines', JSON.stringify(demoRoutines));
  localStorage.setItem('demo_daily_schedule', JSON.stringify(demoDailySchedule));
  
  // Load demo tasks into main tasks storage
  localStorage.setItem('effortless-focus-tasks', JSON.stringify(demoTasks));
  
  // Load demo routines into main routines storage
  localStorage.setItem('effortless-focus-routines', JSON.stringify(demoRoutines));
  
  // Load demo daily schedule
  localStorage.setItem('effortless-focus-daily-schedule', JSON.stringify(demoDailySchedule));
  
  // Set demo auth token
  localStorage.setItem('authToken', 'demo-token-12345');
  localStorage.setItem('demo_mode', 'true');
  
  console.log('🎯 Effortless Focus - Demo Mode Initialized');
  console.log('👤 User:', demoUser.name, `(${demoUser.email})`);
  console.log('📧 Emails loaded:', demoEmails.length);
  console.log('✅ Tasks loaded:', demoTasks.length);
  console.log('🔄 Routines loaded:', demoRoutines.length);
  console.log('🔒 Logout: DISABLED for evaluation');
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

// Helper function to disable demo mode (DISABLED for judges)
export const disableDemoMode = () => {
  // Do nothing - demo mode cannot be disabled
  console.log('⚠️ Demo mode is locked for evaluation');
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

// Get demo routines (for use in components)
export const getDemoRoutines = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('demo_routines');
  return stored ? JSON.parse(stored) : demoRoutines;
};

// Get demo daily schedule (for use in components)
export const getDemoDailySchedule = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('demo_daily_schedule');
  return stored ? JSON.parse(stored) : demoDailySchedule;
};

// Generate today's complete schedule by merging fixed schedule with tasks
export const generateTodaysSchedule = (tasks = [], routines = []) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Get fixed schedule for today
  const fixedSchedule = demoDailySchedule.filter(item => 
    item.daysOfWeek.includes(dayOfWeek)
  );
  
  // Get available time slots between fixed items
  const timeSlots = [];
  const workStartTime = dayOfWeek >= 1 && dayOfWeek <= 5 ? '08:30' : '11:00';
  const workEndTime = dayOfWeek >= 1 && dayOfWeek <= 5 ? '17:30' : '20:00';
  
  // Sort fixed schedule by time
  const sortedFixed = [...fixedSchedule].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  // Find gaps for tasks
  let currentTime = workStartTime;
  sortedFixed.forEach(fixedItem => {
    if (fixedItem.startTime > currentTime && fixedItem.startTime < workEndTime) {
      timeSlots.push({
        start: currentTime,
        end: fixedItem.startTime,
        duration: getMinutesBetween(currentTime, fixedItem.startTime)
      });
    }
    if (fixedItem.endTime > currentTime) {
      currentTime = fixedItem.endTime;
    }
  });
  
  // Add final slot if there's time left
  if (currentTime < workEndTime) {
    timeSlots.push({
      start: currentTime,
      end: workEndTime,
      duration: getMinutesBetween(currentTime, workEndTime)
    });
  }
  
  // Allocate tasks and routines to available slots
  const schedule = [];
  let slotIndex = 0;
  
  // Get pending tasks sorted by urgency
  const pendingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      const urgencyOrder = { now: 0, soon: 1, later: 2 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
  
  // Merge fixed schedule items
  sortedFixed.forEach(item => {
    schedule.push({
      ...item,
      startTime: item.startTime,
      endTime: item.endTime,
      isFixed: true
    });
  });
  
  // Fill time slots with tasks
  pendingTasks.forEach(task => {
    if (slotIndex >= timeSlots.length) return;
    
    const slot = timeSlots[slotIndex];
    const taskDuration = Math.min(task.estimatedMinutes || 30, slot.duration);
    
    if (taskDuration >= 15) { // Only add if at least 15 minutes
      schedule.push({
        id: task.id,
        title: task.title,
        startTime: slot.start,
        endTime: addMinutes(slot.start, taskDuration),
        category: task.category,
        type: 'task',
        urgency: task.urgency,
        estimatedMinutes: taskDuration,
        isFixed: false
      });
      
      // Update slot
      const remainingTime = slot.duration - taskDuration;
      if (remainingTime >= 15) {
        slot.start = addMinutes(slot.start, taskDuration);
        slot.duration = remainingTime;
      } else {
        slotIndex++;
      }
    }
  });
  
  // Sort all by time
  return schedule.sort((a, b) => a.startTime.localeCompare(b.startTime));
};

// Helper: Calculate minutes between two time strings (HH:MM format)
const getMinutesBetween = (start, end) => {
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  return (endHour * 60 + endMin) - (startHour * 60 + startMin);
};

// Helper: Add minutes to time string
const addMinutes = (time, minutes) => {
  const [hour, min] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + min + minutes;
  const newHour = Math.floor(totalMinutes / 60) % 24;
  const newMin = totalMinutes % 60;
  return `${String(newHour).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;
};

// Auto-initialize demo mode on app load
if (typeof window !== 'undefined') {
  // Always enable demo mode for judges
  if (!localStorage.getItem('demo_mode')) {
    enableDemoMode();
  }
}

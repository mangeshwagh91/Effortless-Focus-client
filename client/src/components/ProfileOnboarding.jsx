import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ChevronRight, User, Clock, Calendar, Brain, MessageSquare, Shirt, Plus, Trash2 } from 'lucide-react';

const STEPS = [
  { id: 1, icon: User, title: "Role & Identity", description: "Help us understand who you are" },
  { id: 2, icon: Clock, title: "Daily Time Boundaries", description: "When are you available?" },
  { id: 3, icon: Calendar, title: "Daily Schedule", description: "Add your routine time blocks" },
  { id: 4, icon: Calendar, title: "Fixed Schedule", description: "Your non-negotiable commitments" },
  { id: 5, icon: Brain, title: "Task & Focus Style", description: "How do you work best?" },
  { id: 6, icon: MessageSquare, title: "Communication Preferences", description: "How should we help you?" },
  { id: 7, icon: Shirt, title: "Lifestyle Choices", description: "Automate daily decisions" }
];

export function ProfileOnboarding({ onComplete, onSkip }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    // 1. Role & Identity
    roleIdentity: {
      primaryRole: 'student',
      workNature: 'mixed',
      occupation: '',
      fieldOfStudy: ''
    },
    // 2. Daily Time Boundaries
    timeBoundaries: {
      wakeUpTime: '07:00',
      sleepTime: '23:00',
      workHoursStart: '09:00',
      workHoursEnd: '17:00'
    },
    // 3. Daily Schedule (NEW - Flexible time blocks)
    dailySchedule: [
      { title: 'Breakfast', startTime: '08:00', endTime: '08:30', category: 'meal', daysOfWeek: [1,2,3,4,5,6,0] },
      { title: 'Lunch', startTime: '12:00', endTime: '13:00', category: 'meal', daysOfWeek: [1,2,3,4,5,6,0] },
      { title: 'Dinner', startTime: '19:00', endTime: '20:00', category: 'meal', daysOfWeek: [1,2,3,4,5,6,0] }
    ],
    // 4. Fixed Schedule Anchors
    fixedSchedule: {
      hasWorkSchedule: true,
      workDays: [1, 2, 3, 4, 5],
      commuteTime: 0,
      otherCommitments: ''
    },
    // 5. Task & Focus Preferences
    taskPreferences: {
      focusStyle: 'deep_focus',
      breakTasksIntoParts: true,
      reminderTolerance: 'medium',
      estimatedFocusDuration: 45
    },
    // 6. Communication Handling
    communication: {
      autoSummarizeMessages: true,
      showOnlyActionable: true,
      communicationStyle: 'supportive',
      notificationPreference: 'minimal'
    },
    // 7. Lifestyle Preferences
    lifestyle: {
      clothingStyle: 'comfort',
      dressFormalityLevel: 'casual',
      outfitRepetition: 'comfortable',
      foodPreference: 'veg',
      mealHeaviness: 'medium'
    }
  });

  const updateSection = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Daily Schedule helpers
  const addScheduleBlock = () => {
    setProfile(prev => ({
      ...prev,
      dailySchedule: [
        ...prev.dailySchedule,
        { title: '', startTime: '09:00', endTime: '10:00', category: 'other', daysOfWeek: [1,2,3,4,5,6,0] }
      ]
    }));
  };

  const updateScheduleBlock = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      dailySchedule: prev.dailySchedule.map((block, i) => 
        i === index ? { ...block, [field]: value } : block
      )
    }));
  };

  const toggleScheduleDay = (index, day) => {
    setProfile(prev => ({
      ...prev,
      dailySchedule: prev.dailySchedule.map((block, i) => {
        if (i !== index) return block;
        const days = block.daysOfWeek || [];
        return {
          ...block,
          daysOfWeek: days.includes(day) 
            ? days.filter(d => d !== day)
            : [...days, day].sort()
        };
      })
    }));
  };

  const removeScheduleBlock = (index) => {
    setProfile(prev => ({
      ...prev,
      dailySchedule: prev.dailySchedule.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Please log in first');
        setLoading(false);
        return;
      }

      // Transform data to match backend schema
      const profileData = {
        personal: {
          nickname: profile.roleIdentity.occupation || 'Friend'
        },
        professional: {
          occupation: profile.roleIdentity.occupation,
          fieldOfStudy: profile.roleIdentity.fieldOfStudy,
          workHours: {
            start: profile.timeBoundaries.workHoursStart,
            end: profile.timeBoundaries.workHoursEnd,
            daysOfWeek: profile.fixedSchedule.workDays
          },
          commute: {
            duration: profile.fixedSchedule.commuteTime
          }
        },
        routines: {
          wakeUpTime: profile.timeBoundaries.wakeUpTime,
          sleepTime: profile.timeBoundaries.sleepTime
        },
        dailySchedule: profile.dailySchedule, // NEW: Add flexible daily schedule
        productivity: {
          chronotype: profile.timeBoundaries.wakeUpTime < '07:00' ? 'morning_person' : 
                      profile.timeBoundaries.wakeUpTime > '09:00' ? 'night_owl' : 'flexible',
          averageFocusDuration: profile.taskPreferences.estimatedFocusDuration,
          breakPreferences: {
            duration: 5,
            frequency: profile.taskPreferences.estimatedFocusDuration
          }
        },
        personality: {
          communicationStyle: profile.communication.communicationStyle
        },
        preferences: {
          // Store additional preferences
          roleIdentity: profile.roleIdentity,
          taskPreferences: profile.taskPreferences,
          communication: profile.communication,
          lifestyle: profile.lifestyle
        }
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profile/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        onComplete();
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Onboarding failed:', error);
      alert('Network error. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / STEPS.length) * 100;
  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <StepIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentStep.title}
                  <Badge variant="secondary" className="text-xs">
                    {step} of {STEPS.length}
                  </Badge>
                </CardTitle>
                <CardDescription>{currentStep.description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip}>Skip</Button>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Role & Identity */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">👋 Welcome!</h3>
                <p className="text-sm text-muted-foreground">
                  Let's personalize your experience. This helps our AI understand your context and prioritize what truly matters to you.
                </p>
              </div>

              <div>
                <Label>What's your primary role?</Label>
                <Select
                  value={profile.roleIdentity.primaryRole}
                  onValueChange={(value) => updateSection('roleIdentity', 'primaryRole', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="homemaker">Homemaker</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Nature of your work</Label>
                <Select
                  value={profile.roleIdentity.workNature}
                  onValueChange={(value) => updateSection('roleIdentity', 'workNature', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analytical">Analytical (Data, coding, research)</SelectItem>
                    <SelectItem value="creative">Creative (Design, writing, art)</SelectItem>
                    <SelectItem value="mixed">Mixed (Both analytical & creative)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Your occupation or field</Label>
                <Input
                  placeholder="e.g., Software Engineer, MBA Student, Graphic Designer"
                  value={profile.roleIdentity.occupation}
                  onChange={(e) => updateSection('roleIdentity', 'occupation', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Daily Time Boundaries */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  These boundaries help us schedule tasks when you're actually available and avoid suggesting work during your rest time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Wake-up time</Label>
                  <Input
                    type="time"
                    value={profile.timeBoundaries.wakeUpTime}
                    onChange={(e) => updateSection('timeBoundaries', 'wakeUpTime', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Sleep time</Label>
                  <Input
                    type="time"
                    value={profile.timeBoundaries.sleepTime}
                    onChange={(e) => updateSection('timeBoundaries', 'sleepTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Core work/study start time</Label>
                  <Input
                    type="time"
                    value={profile.timeBoundaries.workHoursStart}
                    onChange={(e) => updateSection('timeBoundaries', 'workHoursStart', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Core work/study end time</Label>
                  <Input
                    type="time"
                    value={profile.timeBoundaries.workHoursEnd}
                    onChange={(e) => updateSection('timeBoundaries', 'workHoursEnd', e.target.value)}
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                💡 We won't schedule urgent tasks outside these hours unless absolutely necessary.
              </div>
            </div>
          )}

          {/* Step 3: Daily Schedule (NEW - Flexible time blocks) */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Add your daily routine - we'll work around them!
                </p>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {profile.dailySchedule.map((block, index) => (
                  <div key={index} className="p-3 bg-card border border-border rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          className="h-9 text-sm"
                          placeholder="Activity (e.g., Lunch, Workout)"
                          value={block.title}
                          onChange={(e) => updateScheduleBlock(index, 'title', e.target.value)}
                        />

                        <div className="grid grid-cols-[1fr_auto_1fr_1fr] gap-2 items-center">
                          <Input
                            className="h-9 text-sm"
                            type="time"
                            value={block.startTime}
                            onChange={(e) => updateScheduleBlock(index, 'startTime', e.target.value)}
                          />
                          <span className="text-sm text-muted-foreground px-1">to</span>
                          <Input
                            className="h-9 text-sm"
                            type="time"
                            value={block.endTime}
                            onChange={(e) => updateScheduleBlock(index, 'endTime', e.target.value)}
                          />
                          <Select
                            value={block.category}
                            onValueChange={(value) => updateScheduleBlock(index, 'category', value)}
                          >
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="meal">Meal</SelectItem>
                              <SelectItem value="exercise">Exercise</SelectItem>
                              <SelectItem value="rest">Rest</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-1">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => {
                            const dayNum = idx;
                            const isSelected = block.daysOfWeek?.includes(dayNum);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleScheduleDay(index, dayNum)}
                                className={`w-7 h-7 rounded-full text-xs font-medium transition-all ${
                                  isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeScheduleBlock(index)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addScheduleBlock}
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Time Block
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Fixed Schedule Anchors */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  Your non-negotiable commitments help us avoid scheduling conflicts.
                </p>
              </div>

              <div>
                <Label>Do you have a fixed work/college schedule?</Label>
                <Select
                  value={profile.fixedSchedule.hasWorkSchedule ? 'yes' : 'no'}
                  onValueChange={(value) => updateSection('fixedSchedule', 'hasWorkSchedule', value === 'yes')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, fixed hours</SelectItem>
                    <SelectItem value="no">No, flexible schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {profile.fixedSchedule.hasWorkSchedule && (
                <div>
                  <Label>Which days do you work/study?</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <button
                        key={day}
                        onClick={() => {
                          const dayNum = idx + 1;
                          const days = profile.fixedSchedule.workDays.includes(dayNum)
                            ? profile.fixedSchedule.workDays.filter(d => d !== dayNum)
                            : [...profile.fixedSchedule.workDays, dayNum];
                          updateSection('fixedSchedule', 'workDays', days.sort());
                        }}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          profile.fixedSchedule.workDays.includes(idx + 1)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Daily travel time (one way, in minutes)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={profile.fixedSchedule.commuteTime}
                  onChange={(e) => updateSection('fixedSchedule', 'commuteTime', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {/* Step 5: Task & Focus Preferences */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  🧠 Understanding your work style helps us structure tasks effectively.
                </p>
              </div>

              <div>
                <Label>What's your preferred work style?</Label>
                <Select
                  value={profile.taskPreferences.focusStyle}
                  onValueChange={(value) => updateSection('taskPreferences', 'focusStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deep_focus">Deep focus sessions (1-2 hours)</SelectItem>
                    <SelectItem value="short_tasks">Short tasks (15-30 mins)</SelectItem>
                    <SelectItem value="mixed">Mixed (depends on the task)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Average focus duration (minutes)</Label>
                <Input
                  type="number"
                  value={profile.taskPreferences.estimatedFocusDuration}
                  onChange={(e) => updateSection('taskPreferences', 'estimatedFocusDuration', parseInt(e.target.value) || 45)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How long can you typically focus before needing a break?
                </p>
              </div>

              <div>
                <Label>Are you comfortable breaking tasks into smaller parts?</Label>
                <Select
                  value={profile.taskPreferences.breakTasksIntoParts ? 'yes' : 'no'}
                  onValueChange={(value) => updateSection('taskPreferences', 'breakTasksIntoParts', value === 'yes')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, helps me stay focused</SelectItem>
                    <SelectItem value="no">No, I prefer complete tasks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reminder preference</Label>
                <Select
                  value={profile.taskPreferences.reminderTolerance}
                  onValueChange={(value) => updateSection('taskPreferences', 'reminderTolerance', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Minimal reminders only</SelectItem>
                    <SelectItem value="medium">Regular reminders (recommended)</SelectItem>
                    <SelectItem value="none">No reminders, I'll check myself</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 6: Communication Handling */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  💬 Control how we help you manage messages and notifications.
                </p>
              </div>

              <div>
                <Label>Should we auto-summarize long messages?</Label>
                <Select
                  value={profile.communication.autoSummarizeMessages ? 'yes' : 'no'}
                  onValueChange={(value) => updateSection('communication', 'autoSummarizeMessages', value === 'yes')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, save me time</SelectItem>
                    <SelectItem value="no">No, I'll read everything</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Show only actionable notifications?</Label>
                <Select
                  value={profile.communication.showOnlyActionable ? 'yes' : 'no'}
                  onValueChange={(value) => updateSection('communication', 'showOnlyActionable', value === 'yes')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, only if I need to act</SelectItem>
                    <SelectItem value="no">No, show me everything</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>How should AI communicate with you?</Label>
                <Select
                  value={profile.communication.communicationStyle}
                  onValueChange={(value) => updateSection('communication', 'communicationStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct (concise, to the point)</SelectItem>
                    <SelectItem value="supportive">Supportive (warm & encouraging)</SelectItem>
                    <SelectItem value="motivational">Motivational (inspire me!)</SelectItem>
                    <SelectItem value="analytical">Analytical (data-driven)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Preview</p>
                <p className="text-xs text-muted-foreground italic">
                  {profile.communication.communicationStyle === 'direct' && 
                    '"You have 3 urgent tasks. Start with the project report."'}
                  {profile.communication.communicationStyle === 'supportive' && 
                    '"You\'re doing great! Let\'s tackle that project report together. You\'ve got this!"'}
                  {profile.communication.communicationStyle === 'motivational' && 
                    '"Time to crush it! That project report won\'t write itself. Let\'s show them what you\'re made of! 🔥"'}
                  {profile.communication.communicationStyle === 'analytical' && 
                    '"Based on your schedule, completing the project report now maximizes efficiency. Estimated time: 2 hours."'}
                </p>
              </div>
            </div>
          )}

          {/* Step 7: Lifestyle Preferences */}
          {step === 7 && (
            <div className="space-y-5">
              <div className="bg-pink-50 dark:bg-pink-950/20 p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  👕 Automate trivial daily decisions to save mental energy.
                </p>
              </div>

              <div>
                <Label>Clothing preference</Label>
                <Select
                  value={profile.lifestyle.clothingStyle}
                  onValueChange={(value) => updateSection('lifestyle', 'clothingStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfort">Comfort over style</SelectItem>
                    <SelectItem value="style">Style matters</SelectItem>
                    <SelectItem value="balanced">Balanced approach</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Dress formality level</Label>
                <Select
                  value={profile.lifestyle.dressFormalityLevel}
                  onValueChange={(value) => updateSection('lifestyle', 'dressFormalityLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal (suits, business attire)</SelectItem>
                    <SelectItem value="smart_casual">Smart Casual</SelectItem>
                    <SelectItem value="casual">Casual (comfortable daily wear)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Repeating outfits</Label>
                <Select
                  value={profile.lifestyle.outfitRepetition}
                  onValueChange={(value) => updateSection('lifestyle', 'outfitRepetition', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict_no">Never repeat consecutively</SelectItem>
                    <SelectItem value="comfortable">Comfortable repeating</SelectItem>
                    <SelectItem value="dont_care">Don't care</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Food preference</Label>
                <Select
                  value={profile.lifestyle.foodPreference}
                  onValueChange={(value) => updateSection('lifestyle', 'foodPreference', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="non_veg">Non-Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="no_preference">No preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Meal preference</Label>
                <Select
                  value={profile.lifestyle.mealHeaviness}
                  onValueChange={(value) => updateSection('lifestyle', 'mealHeaviness', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light meals</SelectItem>
                    <SelectItem value="medium">Balanced meals</SelectItem>
                    <SelectItem value="heavy">Hearty meals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                These preferences will help our Decide feature automatically handle trivial daily choices.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || loading}
            >
              Back
            </Button>
            <Button onClick={handleNext} disabled={loading}>
              {loading ? 'Saving...' : (step === STEPS.length ? '✓ Complete Setup' : <>Next <ChevronRight className="w-4 h-4 ml-1" /></>)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

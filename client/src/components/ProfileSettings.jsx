import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { X, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getDemoUser } from '@/lib/demoData';

export function ProfileSettings({ onClose, onOpenOnboarding }) {
  const { isDemoMode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    personal: { fullName: '', nickname: '', age: '', gender: '', pronouns: '' },
    professional: { 
      occupation: '', 
      company: '', 
      fieldOfStudy: '',
      workHours: { start: '09:00', end: '17:00' },
      remoteWork: false,
      commute: { duration: 0, mode: 'none' }
    },
    living: { 
      type: 'home', 
      location: { city: '', state: '', country: '', timezone: '' },
      hasPrivateSpace: false,
      quietHours: { start: '22:00', end: '08:00' }
    },
    routines: { 
      wakeUpTime: '07:00', 
      sleepTime: '23:00',
      mealTimes: { breakfast: '08:00', lunch: '12:00', dinner: '19:00' },
      exercise: { frequency: 0, preferredTime: '', duration: 0, activities: [] }
    },
    productivity: { 
      chronotype: 'flexible', 
      peakHours: [],
      averageFocusDuration: 25,
      breakPreferences: { duration: 5, frequency: 25 },
      distractionTriggers: []
    },
    personality: { 
      communicationStyle: 'supportive',
      stressManagement: [],
      decisionMaking: 'analytical',
      motivationType: 'achievement'
    }
  });
  const [completeness, setCompleteness] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // In demo mode, load demo user profile
      if (isDemoMode) {
        const demoUser = getDemoUser();
        if (demoUser.userProfile) {
          setProfile(prev => {
            const merged = { ...prev };
            Object.keys(demoUser.userProfile).forEach(key => {
              if (demoUser.userProfile[key] && typeof demoUser.userProfile[key] === 'object') {
                merged[key] = { ...prev[key], ...demoUser.userProfile[key] };
              } else if (demoUser.userProfile[key] !== undefined) {
                merged[key] = demoUser.userProfile[key];
              }
            });
            return merged;
          });
        }
        setCompleteness(85); // Demo profile is fairly complete
        setError('');
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          // Merge with existing default profile structure
          setProfile(prev => {
            const merged = { ...prev };
            Object.keys(data.profile).forEach(key => {
              if (data.profile[key] && typeof data.profile[key] === 'object') {
                merged[key] = { ...prev[key], ...data.profile[key] };
              } else if (data.profile[key] !== undefined) {
                merged[key] = data.profile[key];
              }
            });
            return merged;
          });
        }
        setCompleteness(data.completeness || 0);
        setError(''); // Clear any previous errors
      } else if (response.status === 404) {
        // User profile doesn't exist yet - this is okay, use defaults
        console.log('No profile found, using defaults');
        setError('');
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // Don't show error for network issues, just use defaults
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedProfile = (section, subsection, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    // In demo mode, just show success message without saving
    if (isDemoMode) {
      setSuccess('Profile viewed! (Demo mode - changes not saved)');
      setTimeout(() => setSuccess(''), 3000);
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        const data = await response.json();
        setCompleteness(data.completeness || 0);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Save failed:', err);
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-8 text-center">
            <p>Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Profile Completeness</span>
              <span className="font-semibold">{completeness}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && error !== '' && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Personal Tab */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.personal?.fullName || ''}
                    onChange={(e) => updateProfile('personal', 'fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    value={profile.personal?.nickname || ''}
                    onChange={(e) => updateProfile('personal', 'nickname', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.personal?.age || ''}
                    onChange={(e) => updateProfile('personal', 'age', e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={profile.personal?.gender || ''}
                    onChange={(e) => updateProfile('personal', 'gender', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Work Tab */}
            <TabsContent value="work" className="space-y-4">
              <div>
                <Label htmlFor="company">Company/School</Label>
                <Input
                  id="company"
                  value={profile.professional?.company || ''}
                  onChange={(e) => updateProfile('professional', 'company', e.target.value)}
                  placeholder="Company or school name"
                />
              </div>
              <div>
                <Label htmlFor="fieldOfStudy">Field of Study (if student)</Label>
                <Input
                  id="fieldOfStudy"
                  value={profile.professional?.fieldOfStudy || ''}
                  onChange={(e) => updateProfile('professional', 'fieldOfStudy', e.target.value)}
                  placeholder="e.g., Computer Science, Business Administration"
                />
              </div>
              <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                💡 Work hours and occupation details are managed in the Comprehensive Profile Setup above.
              </div>
            </TabsContent>

            {/* Lifestyle Tab */}
            <TabsContent value="lifestyle" className="space-y-4">
              <div>
                <Label htmlFor="livingType">Where do you live?</Label>
                <Select
                  value={profile.living?.type || 'home'}
                  onValueChange={(value) => updateProfile('living', 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home (Own place)</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="dormitory">Dormitory</SelectItem>
                    <SelectItem value="with_family">With Family</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile.living?.location?.city || ''}
                  onChange={(e) => updateNestedProfile('living', 'location', 'city', e.target.value)}
                  placeholder="New York, London, Mumbai..."
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profile.living?.location?.country || ''}
                  onChange={(e) => updateNestedProfile('living', 'location', 'country', e.target.value)}
                  placeholder="United States, India, UK..."
                />
              </div>
              <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                💡 Daily schedule and time boundaries are managed in the Preferences tab.
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4">
              <div className="border-2 border-primary/20 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Comprehensive Profile Setup</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Want to provide more detailed preferences for better AI personalization? Run the comprehensive onboarding wizard.
                </p>
                <Button 
                  onClick={() => {
                    if (onOpenOnboarding) {
                      onClose();
                      onOpenOnboarding();
                    }
                  }}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Complete Your Profile Setup
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

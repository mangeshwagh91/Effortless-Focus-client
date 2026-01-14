import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Check, Shirt, Coffee, Dumbbell, Plus, Edit2, Trash2, X } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: 'outfit', icon: Shirt, label: 'What to wear', options: ['Casual', 'Formal', 'Smart casual', 'Comfortable'], isCustom: false },
  { id: 'lunch', icon: Coffee, label: 'Lunch choice', options: ['Salad', 'Sandwich', 'Pasta', 'Rice bowl'], isCustom: false },
  { id: 'dinner', icon: Coffee, label: 'Dinner choice', options: ['Home cooked', 'Order in', 'Dine out', 'Meal prep'], isCustom: false },
  { id: 'exercise', icon: Dumbbell, label: 'Exercise routine', options: ['Cardio', 'Strength training', 'Yoga', 'Rest day'], isCustom: false }
];

export function DecisionsMode() {
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [decision, setDecision] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryOptions, setNewCategoryOptions] = useState(['', '']);
  const [recentDecisions, setRecentDecisions] = useState([]);

  useEffect(() => {
    loadProfile();
    loadCustomCategories();
    loadRecentDecisions();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const loadCustomCategories = () => {
    const saved = localStorage.getItem('customDecisions');
    const custom = saved ? JSON.parse(saved) : [];
    
    // Load edited default categories
    const editedDefaults = localStorage.getItem('defaultDecisionsEdits');
    const edits = editedDefaults ? JSON.parse(editedDefaults) : [];
    
    // Merge edits with defaults
    const mergedDefaults = DEFAULT_CATEGORIES.map(def => {
      const edit = edits.find(e => e.id === def.id);
      return edit ? { ...def, label: edit.label, options: edit.options } : def;
    });
    
    setCategories([...mergedDefaults, ...custom]);
  };

  const loadRecentDecisions = () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('decisionHistory');
    if (!saved) return;
    
    const history = JSON.parse(saved);
    // Filter for today's decisions only
    const todaysDecisions = history.filter(d => new Date(d.timestamp).toDateString() === today);
    setRecentDecisions(todaysDecisions);
  };

  const saveDecisionToHistory = (category, choice, reason) => {
    const decision = {
      category: category.label,
      choice,
      reason,
      timestamp: new Date().toISOString()
    };
    
    const saved = localStorage.getItem('decisionHistory');
    const history = saved ? JSON.parse(saved) : [];
    
    // Keep only last 50 decisions
    const updated = [decision, ...history].slice(0, 50);
    localStorage.setItem('decisionHistory', JSON.stringify(updated));
    
    // Update recent decisions
    const today = new Date().toDateString();
    const todaysDecisions = updated.filter(d => new Date(d.timestamp).toDateString() === today);
    setRecentDecisions(todaysDecisions);
  };

  const saveCustomCategories = (updatedCategories) => {
    const customOnly = updatedCategories.filter(c => c.isCustom);
    localStorage.setItem('customDecisions', JSON.stringify(customOnly));
    
    // Save edits to default categories
    const defaultEdits = updatedCategories
      .filter(c => !c.isCustom)
      .map(c => ({ id: c.id, label: c.label, options: c.options }));
    localStorage.setItem('defaultDecisionsEdits', JSON.stringify(defaultEdits));
    
    setCategories(updatedCategories);
  };

  const addCustomCategory = () => {
    if (!newCategoryName.trim()) return;
    const validOptions = newCategoryOptions.filter(o => o.trim());
    if (validOptions.length < 2) return;

    const newCategory = {
      id: `custom_${Date.now()}`,
      icon: Sparkles,
      label: newCategoryName.trim(),
      options: validOptions.map(o => o.trim()),
      isCustom: true
    };

    const updated = [...categories, newCategory];
    saveCustomCategories(updated);
    
    setNewCategoryName('');
    setNewCategoryOptions(['', '', '']);
    setShowAddForm(false);
  };

  const updateCustomCategory = () => {
    if (!newCategoryName.trim() || !editingCategory) return;
    const validOptions = newCategoryOptions.filter(o => o.trim());
    if (validOptions.length < 2) return;

    const updated = categories.map(c => 
      c.id === editingCategory.id 
        ? { ...c, label: newCategoryName.trim(), options: validOptions.map(o => o.trim()) }
        : c
    );

    saveCustomCategories(updated);
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryOptions(['', '', '']);
  };

  const deleteCustomCategory = (categoryId) => {
    const updated = categories.filter(c => c.id !== categoryId);
    saveCustomCategories(updated);
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.label);
    setNewCategoryOptions([...category.options]);
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryOptions(['', '']);
  };

  const addOptionField = () => {
    setNewCategoryOptions([...newCategoryOptions, '']);
  };

  const removeOptionField = (index) => {
    if (newCategoryOptions.length <= 2) return; // Keep at least 2
    const updated = newCategoryOptions.filter((_, i) => i !== index);
    setNewCategoryOptions(updated);
  };

  const updateOptionField = (index, value) => {
    const updated = [...newCategoryOptions];
    updated[index] = value;
    setNewCategoryOptions(updated);
  };

  const generateDecision = async (category) => {
    setCurrentCategory(category);
    setIsGenerating(true);
    setDecision(null);

    try {
      const token = localStorage.getItem('authToken');
      
      // Use AI for decision making
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai/make-decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          category: category.label,
          options: category.options,
          recentDecisions: recentDecisions.map(d => ({ category: d.category, choice: d.choice }))
        })
      });

      if (!response.ok) throw new Error('AI decision failed');

      const data = await response.json();
      const aiDecision = {
        choice: data.choice,
        reason: data.reason,
        aiPowered: data.aiPowered
      };

      setDecision(aiDecision);
      saveDecisionToHistory(category, aiDecision.choice, aiDecision.reason);
    } catch (error) {
      console.error('Failed to get AI decision:', error);
      
      // Fallback to random selection
      const fallbackDecision = makeCustomDecision(category);
      setDecision(fallbackDecision);
      saveDecisionToHistory(category, fallbackDecision.choice, fallbackDecision.reason);
    } finally {
      setIsGenerating(false);
    }
  };

  const makeCustomDecision = (category) => {
    const choice = category.options[Math.floor(Math.random() * category.options.length)];
    const reasons = [
      'I think this is a good choice for you',
      'This should work well',
      'Based on your preferences, this fits',
      'I picked this for you',
      'This seems like the right option'
    ];
    return { 
      choice, 
      reason: reasons[Math.floor(Math.random() * reasons.length)]
    };
  };

  const makeDecision = (categoryId, userProfile) => {
    const preferences = userProfile?.preferences;
    const lifestyle = preferences?.lifestyle;
    const routines = userProfile?.routines;

    switch (categoryId) {
      case 'outfit':
        return generateOutfitDecision(lifestyle);
      case 'breakfast':
      case 'lunch':
      case 'dinner':
        return generateMealDecision(categoryId, lifestyle);
      case 'exercise':
        return generateExerciseDecision(routines);
      case 'morning':
        return generateMorningDecision(routines);
      case 'evening':
        return generateEveningDecision(routines);
      case 'weekend':
        return generateWeekendDecision(preferences);
      default:
        return { choice: 'Take a break', reason: 'Default suggestion' };
    }
  };

  const generateOutfitDecision = (lifestyle) => {
    const style = lifestyle?.clothingStyle || 'comfort';
    const formality = lifestyle?.dressFormalityLevel || 'casual';
    
    const outfits = {
      casual_comfort: ['Comfortable jeans and t-shirt', 'Joggers and hoodie', 'Casual shorts and polo'],
      casual_style: ['Well-fitted jeans and stylish top', 'Casual blazer with chinos', 'Trendy streetwear combo'],
      smart_casual_comfort: ['Chinos with button-down', 'Dark jeans with blazer', 'Comfortable dress pants and sweater'],
      smart_casual_style: ['Fitted blazer and dress pants', 'Designer jeans with nice shirt', 'Smart casual suit combo'],
      formal_comfort: ['Comfortable suit with soft fabric', 'Business casual with loafers', 'Breathable formal attire'],
      formal_style: ['Sharp tailored suit', 'Designer formal wear', 'Elegant business attire']
    };

    const key = `${formality}_${style}`;
    const options = outfits[key] || outfits['casual_comfort'];
    const choice = options[Math.floor(Math.random() * options.length)];

    const reasons = [
      `I'd suggest this based on your ${formality} style preference and ${style} priority`,
      `Given your ${formality} approach and ${style} focus, this feels right`,
      `This matches your ${formality} style and ${style} preference perfectly`,
      `Considering your ${formality} vibe and ${style} priority, I think you'll like this`
    ];

    return {
      choice,
      reason: reasons[Math.floor(Math.random() * reasons.length)]
    };
  };

  const generateMealDecision = (mealType, lifestyle) => {
    const foodPref = lifestyle?.foodPreference || 'no_preference';
    const heaviness = lifestyle?.mealHeaviness || 'medium';

    const meals = {
      breakfast: {
        light: ['Fruit smoothie', 'Yogurt with granola', 'Toast with avocado'],
        medium: ['Oatmeal with berries', 'Eggs and toast', 'Pancakes'],
        heavy: ['Full breakfast with eggs and bacon', 'Breakfast burrito', 'Protein bowl']
      },
      lunch: {
        light: ['Garden salad', 'Soup and bread', 'Wrap'],
        medium: ['Sandwich with sides', 'Rice bowl', 'Pasta'],
        heavy: ['Burger with fries', 'Pizza', 'Full meal with protein']
      },
      dinner: {
        light: ['Grilled vegetables', 'Light salad', 'Soup'],
        medium: ['Stir fry', 'Pasta dish', 'Curry with rice'],
        heavy: ['Steak dinner', 'Large pasta', 'Full course meal']
      }
    };

    const mealOptions = meals[mealType]?.[heaviness] || meals[mealType]?.['medium'] || ['Simple meal'];
    let choice = mealOptions[Math.floor(Math.random() * mealOptions.length)];

    // Adjust for dietary preference
    if (foodPref === 'veg' || foodPref === 'vegan') {
      choice = choice.replace(/bacon|steak|burger/gi, 'plant-based alternative');
    }

    const reasons = [
      `Perfect for a ${heaviness} ${mealType}${foodPref !== 'no_preference' ? `, and it's ${foodPref}` : ''}`,
      `I picked this considering your ${heaviness} meal preference${foodPref !== 'no_preference' ? ` and ${foodPref} diet` : ''}`,
      `This should work well—${heaviness} ${mealType}${foodPref !== 'no_preference' ? `, ${foodPref} friendly` : ''}`,
      `Based on your ${heaviness} preference for ${mealType}${foodPref !== 'no_preference' ? `, keeping it ${foodPref}` : ''}`
    ];

    return {
      choice,
      reason: reasons[Math.floor(Math.random() * reasons.length)]
    };
  };

  const generateExerciseDecision = (routines) => {
    const exercises = ['30-minute run', '20-minute HIIT', 'Yoga session', 'Strength training', 'Cycling', 'Swimming'];
    const choice = exercises[Math.floor(Math.random() * exercises.length)];

    const reasons = [
      'This will keep your routine varied and balanced',
      'Good for maintaining overall fitness',
      'I think this fits well with a balanced approach',
      'Mixing things up keeps it interesting'
    ];

    return {
      choice,
      reason: reasons[Math.floor(Math.random() * reasons.length)]
    };
  };

  const generateMorningDecision = (routines) => {
    const activities = ['10-minute meditation', 'Quick stretch routine', 'Journal for 5 minutes', 'Review daily goals', 'Light reading'];
    const choice = activities[Math.floor(Math.random() * activities.length)];

    const reasons = [
      'A mindful way to start your day',
      'This should set a positive tone for the morning',
      'Great for easing into the day',
      'I think this will help you start fresh'
    ];

    return {
      choice,
      reason: reasons[Math.floor(Math.random() * reasons.length)]
    };
  };

  const generateEveningDecision = (routines) => {
    const activities = ['Wind-down walk', 'Light reading', 'Gentle stretching', 'Evening journaling', 'Early bedtime prep'];
    const choice = activities[Math.floor(Math.random() * activities.length)];

    const reasons = [
      'Perfect for winding down before sleep',
      'This should help you relax and unwind',
      'A calming way to end your day',
      'I think this will help you transition to rest mode'
    ];

    return {
      choice,
      reason: reasons[Math.floor(Math.random() * reasons.length)]
    };
  };

  const generateWeekendDecision = (preferences) => {
    const activities = ['Try a new restaurant', 'Visit a local park', 'Movie night at home', 'Day trip nearby', 'Hobby project', 'Meet friends'];
    const choice = activities[Math.floor(Math.random() * activities.length)];

    return {
      choice,
      reason: 'Balance relaxation and activity'
    };
  };

  const handleDone = () => {
    setCurrentCategory(null);
    setDecision(null);
  };

  // Show add/edit form
  if (showAddForm || editingCategory) {
    return (
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card/80 backdrop-blur rounded-3xl p-6 border border-border/30 shadow-soft">
          <h3 className="text-lg font-medium mb-4">
            {editingCategory ? 'Edit Decision' : 'Add Custom Decision'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Decision name</label>
              <input
                type="text"
                placeholder="e.g., What to drink, Movie genre..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm border-none outline-none text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Options (add at least 2)</label>
              <div className="space-y-2">
                {newCategoryOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => updateOptionField(i, e.target.value)}
                      className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-sm border-none outline-none text-foreground placeholder:text-muted-foreground/50"
                    />
                    {newCategoryOptions.length > 2 && (
                      <button
                        onClick={() => removeOptionField(i)}
                        className="p-2 rounded-lg bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addOptionField}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border/50 hover:border-primary/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add option
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                if (editingCategory) {
                  cancelEdit();
                } else {
                  setShowAddForm(false);
                  setNewCategoryName('');
                  setNewCategoryOptions(['', '']);
                }
              }}
              className="flex-1 px-4 py-2 rounded-xl text-sm bg-muted hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingCategory ? updateCustomCategory : addCustomCategory}
              className="flex-1 px-4 py-2 rounded-xl text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {editingCategory ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show result view
  if (currentCategory && decision) {
    const Icon = currentCategory.icon;
    
    return (
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card/80 backdrop-blur rounded-3xl p-8 border border-border/30 shadow-soft">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-3">{currentCategory.label}</p>
            <h3 className="text-2xl font-display font-medium text-foreground mb-2">
              {decision.choice}
            </h3>
            <p className="text-sm text-muted-foreground/80 italic">{decision.reason}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => generateDecision(currentCategory)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm bg-muted hover:bg-muted/80 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Different choice
            </button>
            <button
              onClick={handleDone}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Check className="w-4 h-4" />
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show generating view
  if (isGenerating) {
    return (
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card/80 backdrop-blur rounded-3xl p-12 border border-border/30 shadow-soft text-center">
          <div className="animate-pulse mb-4">
            <Sparkles className="w-8 h-8 text-primary mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground">Deciding for you...</p>
        </div>
      </div>
    );
  }

  // Show category selection view
  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-xl font-display font-medium text-foreground mb-2">
          Decision-Free Living
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap to receive an instant decision
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id} className="relative group">
              <button
                onClick={() => generateDecision(category)}
                className="w-full bg-card/60 backdrop-blur rounded-2xl p-5 border border-border/30 hover:border-primary/30 hover:bg-card/80 transition-all text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground">{category.label}</p>
              </button>
              
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(category);
                  }}
                  className="p-1.5 rounded-lg bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                {category.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomCategory(category.id);
                    }}
                    className="p-1.5 rounded-lg bg-muted/80 hover:bg-destructive/80 text-muted-foreground hover:text-destructive-foreground transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-card/60 backdrop-blur rounded-2xl p-5 border border-dashed border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all text-center"
        >
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-xl bg-muted/50">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Add custom</p>
        </button>
      </div>

      {!profile && (
        <div className="mt-6 p-4 rounded-xl bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Complete your profile setup for personalized decisions
          </p>
        </div>
      )}
    </div>
  );
}
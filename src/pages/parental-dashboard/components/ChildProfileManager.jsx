import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChildProfileManager = ({ className = '' }) => {
  const [childProfiles, setChildProfiles] = useState([
    {
      id: 'child-1',
      name: 'Emma',
      age: 8,
      avatar: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg',
      supervisionLevel: 'strict',
      totalVideos: 23,
      watchTime: '12h 45m',
      lastActive: '2025-01-13T18:30:00',
      safetyScore: 98,
      isActive: true,
      preferences: {
        favoriteCategories: ['educational', 'creative'],
        allowedHours: { start: '16:00', end: '19:00' },
        dailyLimit: 120
      }
    },
    {
      id: 'child-2',
      name: 'Liam',
      age: 6,
      avatar: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      supervisionLevel: 'strict',
      totalVideos: 15,
      watchTime: '8h 22m',
      lastActive: '2025-01-13T17:15:00',
      safetyScore: 100,
      isActive: false,
      preferences: {
        favoriteCategories: ['music', 'stories'],
        allowedHours: { start: '15:00', end: '18:00' },
        dailyLimit: 90
      }
    },
    {
      id: 'child-3',
      name: 'Sophie',
      age: 10,
      avatar: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
      supervisionLevel: 'moderate',
      totalVideos: 31,
      watchTime: '18h 12m',
      lastActive: '2025-01-13T19:45:00',
      safetyScore: 95,
      isActive: true,
      preferences: {
        favoriteCategories: ['creative', 'music', 'games'],
        allowedHours: { start: '16:00', end: '20:00' },
        dailyLimit: 150
      }
    }
  ]);

  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    age: '',
    supervisionLevel: 'strict'
  });

  const supervisionLevels = [
    {
      value: 'strict',
      label: 'Strict',
      description: 'Maximum protection and oversight',
      color: 'bg-success',
      icon: 'ShieldCheck'
    },
    {
      value: 'moderate',
      label: 'Moderate',
      description: 'Balanced protection with some freedom',
      color: 'bg-warning',
      icon: 'Shield'
    },
    {
      value: 'relaxed',
      label: 'Relaxed',
      description: 'Minimal restrictions for older children',
      color: 'bg-error',
      icon: 'ShieldAlert'
    }
  ];

  const handleAddProfile = () => {
    if (newProfile?.name && newProfile?.age) {
      const profile = {
        id: `child-${Date.now()}`,
        name: newProfile?.name,
        age: parseInt(newProfile?.age),
        avatar: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg',
        supervisionLevel: newProfile?.supervisionLevel,
        totalVideos: 0,
        watchTime: '0h 0m',
        lastActive: new Date()?.toISOString(),
        safetyScore: 100,
        isActive: false,
        preferences: {
          favoriteCategories: ['educational'],
          allowedHours: { start: '16:00', end: '19:00' },
          dailyLimit: 120
        }
      };
      
      setChildProfiles([...childProfiles, profile]);
      setNewProfile({ name: '', age: '', supervisionLevel: 'strict' });
      setShowAddProfile(false);
    }
  };

  const handleSupervisionChange = (childId, newLevel) => {
    setChildProfiles(profiles =>
      profiles?.map(profile =>
        profile?.id === childId
          ? { ...profile, supervisionLevel: newLevel }
          : profile
      )
    );
  };

  const getSupervisionConfig = (level) => {
    return supervisionLevels?.find(s => s?.value === level) || supervisionLevels?.[0];
  };

  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading text-foreground">Child Profiles</h3>
        <Button
          variant="default"
          size="default"
          onClick={() => setShowAddProfile(true)}
          iconName="Plus"
          iconPosition="left"
          iconSize={18}
        >
          Add Child
        </Button>
      </div>
      {/* Add Profile Modal */}
      {showAddProfile && (
        <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-heading text-foreground">Add New Child Profile</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAddProfile(false)}
              iconName="X"
              iconSize={18}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Input
              label="Child's Name"
              type="text"
              placeholder="Enter name"
              value={newProfile?.name}
              onChange={(e) => setNewProfile({ ...newProfile, name: e?.target?.value })}
              required
            />
            <Input
              label="Age"
              type="number"
              placeholder="Enter age"
              min="3"
              max="17"
              value={newProfile?.age}
              onChange={(e) => setNewProfile({ ...newProfile, age: e?.target?.value })}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-caption font-medium text-foreground mb-3">
              Supervision Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {supervisionLevels?.map((level) => (
                <button
                  key={level?.value}
                  onClick={() => setNewProfile({ ...newProfile, supervisionLevel: level?.value })}
                  className={`p-3 border-2 rounded-xl text-left animate-gentle hover:shadow-soft ${
                    newProfile?.supervisionLevel === level?.value
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name={level?.icon} size={16} className="text-foreground" />
                    <span className="font-caption font-medium text-foreground text-sm">
                      {level?.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {level?.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              size="default"
              onClick={() => setShowAddProfile(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="default"
              onClick={handleAddProfile}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Add Profile
            </Button>
          </div>
        </div>
      )}
      {/* Child Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {childProfiles?.map((child) => {
          const supervisionConfig = getSupervisionConfig(child?.supervisionLevel);
          
          return (
            <div
              key={child?.id}
              className="bg-surface border border-border rounded-xl p-6 shadow-soft hover:shadow-medium animate-gentle"
            >
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={child?.avatar}
                      alt={child?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${
                    child?.isActive ? 'bg-success' : 'bg-muted'
                  } rounded-full border-2 border-surface flex items-center justify-center`}>
                    <div className={`w-2 h-2 rounded-full ${
                      child?.isActive ? 'bg-white' : 'bg-text-secondary'
                    }`} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-heading text-foreground">{child?.name}</h4>
                    <span className="text-sm text-text-secondary font-caption">
                      ({child?.age} years old)
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary font-caption">
                    Last active: {formatLastActive(child?.lastActive)}
                  </p>
                </div>

                <div className={`px-3 py-1 ${supervisionConfig?.color} text-white rounded-lg flex items-center space-x-1`}>
                  <Icon name={supervisionConfig?.icon} size={14} />
                  <span className="text-xs font-caption font-medium">
                    {supervisionConfig?.label}
                  </span>
                </div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-heading text-foreground">
                    {child?.totalVideos}
                  </div>
                  <div className="text-xs text-text-secondary font-caption">
                    Videos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-heading text-foreground">
                    {child?.watchTime}
                  </div>
                  <div className="text-xs text-text-secondary font-caption">
                    Watch Time
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-heading text-success">
                    {child?.safetyScore}%
                  </div>
                  <div className="text-xs text-text-secondary font-caption">
                    Safety Score
                  </div>
                </div>
              </div>
              {/* Supervision Level Selector */}
              <div className="mb-4">
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  Supervision Level
                </label>
                <div className="flex space-x-2">
                  {supervisionLevels?.map((level) => (
                    <button
                      key={level?.value}
                      onClick={() => handleSupervisionChange(child?.id, level?.value)}
                      className={`flex-1 p-2 border rounded-lg text-xs font-caption animate-gentle ${
                        child?.supervisionLevel === level?.value
                          ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 text-text-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <Icon name={level?.icon} size={12} />
                        <span>{level?.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Quick Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="BarChart3"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Analytics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Video"
                  iconSize={14}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChildProfileManager;
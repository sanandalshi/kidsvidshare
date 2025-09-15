import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const SafetyControlsPanel = ({ className = '' }) => {
  const [safetySettings, setSafetySettings] = useState({
    contentFiltering: {
      enabled: true,
      level: 'strict',
      blockInappropriate: true,
      requireApproval: true,
      filterComments: true
    },
    sharingPermissions: {
      allowPublicSharing: false,
      allowFriendSharing: true,
      requireParentApproval: true,
      showInGallery: true
    },
    timeRestrictions: {
      enabled: true,
      dailyLimit: 120,
      weekdayStart: '16:00',
      weekdayEnd: '19:00',
      weekendStart: '09:00',
      weekendEnd: '20:00'
    },
    notifications: {
      uploadAlerts: true,
      sharingAlerts: true,
      timeWarnings: true,
      weeklyReports: true
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSafetySettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [setting]: value
      }
    }));
  };

  const contentFilterLevels = [
    {
      value: 'strict',
      label: 'Strict',
      description: 'Maximum protection with comprehensive filtering',
      icon: 'ShieldCheck',
      color: 'text-success'
    },
    {
      value: 'moderate',
      label: 'Moderate',
      description: 'Balanced protection with some flexibility',
      icon: 'Shield',
      color: 'text-warning'
    },
    {
      value: 'basic',
      label: 'Basic',
      description: 'Minimal filtering for older children',
      icon: 'ShieldAlert',
      color: 'text-error'
    }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Content Filtering */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="Filter" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">Content Filtering</h3>
            <p className="text-sm text-text-secondary font-caption">
              Control what content your children can access
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Filter Level Selection */}
          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-3">
              Protection Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {contentFilterLevels?.map((level) => (
                <button
                  key={level?.value}
                  onClick={() => handleSettingChange('contentFiltering', 'level', level?.value)}
                  className={`p-4 border-2 rounded-xl text-left animate-gentle hover:shadow-soft ${
                    safetySettings?.contentFiltering?.level === level?.value
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name={level?.icon} size={18} className={level?.color} />
                    <span className="font-caption font-medium text-foreground">
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

          {/* Filter Options */}
          <div className="space-y-4">
            <Checkbox
              label="Block inappropriate content automatically"
              description="AI-powered content scanning and blocking"
              checked={safetySettings?.contentFiltering?.blockInappropriate}
              onChange={(e) => handleSettingChange('contentFiltering', 'blockInappropriate', e?.target?.checked)}
            />
            <Checkbox
              label="Require parent approval for all uploads"
              description="All videos must be reviewed before publishing"
              checked={safetySettings?.contentFiltering?.requireApproval}
              onChange={(e) => handleSettingChange('contentFiltering', 'requireApproval', e?.target?.checked)}
            />
            <Checkbox
              label="Filter comments and interactions"
              description="Automatically moderate comments and messages"
              checked={safetySettings?.contentFiltering?.filterComments}
              onChange={(e) => handleSettingChange('contentFiltering', 'filterComments', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Sharing Permissions */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
            <Icon name="Share2" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">Sharing Permissions</h3>
            <p className="text-sm text-text-secondary font-caption">
              Manage how your children can share their videos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Allow public sharing"
            description="Videos can be shared publicly on the platform"
            checked={safetySettings?.sharingPermissions?.allowPublicSharing}
            onChange={(e) => handleSettingChange('sharingPermissions', 'allowPublicSharing', e?.target?.checked)}
          />
          <Checkbox
            label="Allow sharing with friends"
            description="Videos can be shared with approved friends"
            checked={safetySettings?.sharingPermissions?.allowFriendSharing}
            onChange={(e) => handleSettingChange('sharingPermissions', 'allowFriendSharing', e?.target?.checked)}
          />
          <Checkbox
            label="Require parent approval for sharing"
            description="All sharing requests need parent permission"
            checked={safetySettings?.sharingPermissions?.requireParentApproval}
            onChange={(e) => handleSettingChange('sharingPermissions', 'requireParentApproval', e?.target?.checked)}
          />
          <Checkbox
            label="Show videos in public gallery"
            description="Approved videos appear in the main gallery"
            checked={safetySettings?.sharingPermissions?.showInGallery}
            onChange={(e) => handleSettingChange('sharingPermissions', 'showInGallery', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Time Restrictions */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-warning rounded-xl flex items-center justify-center">
            <Icon name="Clock" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">Time Restrictions</h3>
            <p className="text-sm text-text-secondary font-caption">
              Set healthy screen time limits
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Checkbox
            label="Enable time restrictions"
            description="Enforce daily and hourly usage limits"
            checked={safetySettings?.timeRestrictions?.enabled}
            onChange={(e) => handleSettingChange('timeRestrictions', 'enabled', e?.target?.checked)}
          />

          {safetySettings?.timeRestrictions?.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-warning/20">
              <div>
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  Daily Time Limit: {safetySettings?.timeRestrictions?.dailyLimit} minutes
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="15"
                  value={safetySettings?.timeRestrictions?.dailyLimit}
                  onChange={(e) => handleSettingChange('timeRestrictions', 'dailyLimit', parseInt(e?.target?.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-text-secondary font-caption mt-1">
                  <span>30 min</span>
                  <span>5 hours</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-caption font-medium text-foreground mb-2">
                    Weekday Hours
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={safetySettings?.timeRestrictions?.weekdayStart}
                      onChange={(e) => handleSettingChange('timeRestrictions', 'weekdayStart', e?.target?.value)}
                      className="px-3 py-2 border border-border rounded-lg text-sm font-caption"
                    />
                    <span className="text-text-secondary">to</span>
                    <input
                      type="time"
                      value={safetySettings?.timeRestrictions?.weekdayEnd}
                      onChange={(e) => handleSettingChange('timeRestrictions', 'weekdayEnd', e?.target?.value)}
                      className="px-3 py-2 border border-border rounded-lg text-sm font-caption"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-caption font-medium text-foreground mb-2">
                    Weekend Hours
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={safetySettings?.timeRestrictions?.weekendStart}
                      onChange={(e) => handleSettingChange('timeRestrictions', 'weekendStart', e?.target?.value)}
                      className="px-3 py-2 border border-border rounded-lg text-sm font-caption"
                    />
                    <span className="text-text-secondary">to</span>
                    <input
                      type="time"
                      value={safetySettings?.timeRestrictions?.weekendEnd}
                      onChange={(e) => handleSettingChange('timeRestrictions', 'weekendEnd', e?.target?.value)}
                      className="px-3 py-2 border border-border rounded-lg text-sm font-caption"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Notifications */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
            <Icon name="Bell" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">Notifications</h3>
            <p className="text-sm text-text-secondary font-caption">
              Stay informed about your child's activities
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Upload alerts"
            description="Get notified when your child uploads a video"
            checked={safetySettings?.notifications?.uploadAlerts}
            onChange={(e) => handleSettingChange('notifications', 'uploadAlerts', e?.target?.checked)}
          />
          <Checkbox
            label="Sharing alerts"
            description="Get notified when videos are shared"
            checked={safetySettings?.notifications?.sharingAlerts}
            onChange={(e) => handleSettingChange('notifications', 'sharingAlerts', e?.target?.checked)}
          />
          <Checkbox
            label="Time limit warnings"
            description="Get alerts when approaching daily limits"
            checked={safetySettings?.notifications?.timeWarnings}
            onChange={(e) => handleSettingChange('notifications', 'timeWarnings', e?.target?.checked)}
          />
          <Checkbox
            label="Weekly activity reports"
            description="Receive weekly summaries of activity"
            checked={safetySettings?.notifications?.weeklyReports}
            onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Save Settings */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          size="lg"
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={18}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="default"
          size="lg"
          iconName="Save"
          iconPosition="left"
          iconSize={18}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SafetyControlsPanel;
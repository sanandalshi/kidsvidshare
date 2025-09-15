import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SafetySettingsForm = ({ formData, onFormChange, onComplete, onPrevious, className = '' }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.contentFilterLevel) {
      newErrors.contentFilterLevel = 'Please select a content filter level';
    }

    if (!formData?.timeLimit) {
      newErrors.timeLimit = 'Please set a daily time limit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onComplete();
    }
  };

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
    if (errors?.[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const contentFilterOptions = [
    { 
      value: 'strict', 
      label: 'Strict (Ages 4-6)', 
      description: 'Only educational and very simple content' 
    },
    { 
      value: 'moderate', 
      label: 'Moderate (Ages 7-9)', 
      description: 'Educational content plus age-appropriate entertainment' 
    },
    { 
      value: 'relaxed', 
      label: 'Relaxed (Ages 10-12)', 
      description: 'Broader content with parental oversight' 
    }
  ];

  const timeLimitOptions = [
    { value: '30', label: '30 minutes per day' },
    { value: '60', label: '1 hour per day' },
    { value: '90', label: '1.5 hours per day' },
    { value: '120', label: '2 hours per day' },
    { value: 'unlimited', label: 'No time limit' }
  ];

  const safetyFeatures = [
    {
      id: 'autoModeration',
      title: 'Automatic Content Moderation',
      description: 'AI scans all videos before they\'re viewable',
      icon: 'Bot',
      recommended: true
    },
    {
      id: 'commentBlocking',
      title: 'Block Comments',
      description: 'Prevent others from commenting on your child\'s videos',
      icon: 'MessageSquareOff',
      recommended: true
    },
    {
      id: 'downloadPrevention',
      title: 'Prevent Downloads',
      description: 'Stop others from downloading your child\'s videos',
      icon: 'Download',
      recommended: true
    },
    {
      id: 'locationBlocking',
      title: 'Hide Location Data',
      description: 'Remove location information from uploaded videos',
      icon: 'MapPin',
      recommended: true
    },
    {
      id: 'shareNotifications',
      title: 'Share Notifications',
      description: 'Get notified when your child shares a video',
      icon: 'Bell',
      recommended: false
    },
    {
      id: 'weeklyReports',
      title: 'Weekly Activity Reports',
      description: 'Receive summaries of your child\'s activity',
      icon: 'FileText',
      recommended: false
    }
  ];

  const toggleSafetyFeature = (featureId) => {
    const currentFeatures = formData?.safetyFeatures || [];
    const newFeatures = currentFeatures?.includes(featureId)
      ? currentFeatures?.filter(id => id !== featureId)
      : [...currentFeatures, featureId];
    
    handleInputChange('safetyFeatures', newFeatures);
  };

  return (
    <div className={`bg-surface rounded-xl p-6 shadow-soft ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
          <Icon name="Settings" size={32} color="white" />
        </div>
        <h3 className="text-xl font-heading text-primary mb-2">
          Configure Safety Settings
        </h3>
        <p className="text-text-secondary font-caption">
          Set up the perfect safety level for your child's video experience
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Filter Level */}
        <Select
          label="Content Filter Level"
          placeholder="Choose filter level"
          options={contentFilterOptions}
          value={formData?.contentFilterLevel || ''}
          onChange={(value) => handleInputChange('contentFilterLevel', value)}
          error={errors?.contentFilterLevel}
          required
          description="This determines what type of content your child can view"
          className="mb-4"
        />

        {/* Daily Time Limit */}
        <Select
          label="Daily Time Limit"
          placeholder="Set time limit"
          options={timeLimitOptions}
          value={formData?.timeLimit || ''}
          onChange={(value) => handleInputChange('timeLimit', value)}
          error={errors?.timeLimit}
          required
          description="How long can your child use the app each day?"
          className="mb-4"
        />

        {/* Safety Features */}
        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-4">
            Safety Features
          </label>
          <div className="space-y-3">
            {safetyFeatures?.map((feature) => {
              const isSelected = (formData?.safetyFeatures || [])?.includes(feature?.id);
              
              return (
                <div
                  key={feature?.id}
                  className={`border rounded-lg p-4 animate-gentle hover:shadow-soft ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-secondary'
                      }`}>
                        <Icon name={feature?.icon} size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-caption font-medium text-foreground">
                            {feature?.title}
                          </h4>
                          {feature?.recommended && (
                            <span className="px-2 py-1 bg-success text-success-foreground text-xs font-caption rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                          {feature?.description}
                        </p>
                      </div>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSafetyFeature(feature?.id)}
                      className="mt-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Setup Options */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-caption font-medium text-foreground mb-3 flex items-center">
            <Icon name="Zap" size={18} className="text-primary mr-2" />
            Quick Setup Options
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => {
                handleInputChange('contentFilterLevel', 'strict');
                handleInputChange('timeLimit', '60');
                handleInputChange('safetyFeatures', ['autoModeration', 'commentBlocking', 'downloadPrevention', 'locationBlocking']);
              }}
              iconName="Shield"
              iconPosition="left"
              iconSize={18}
              className="child-friendly-button justify-start"
            >
              Maximum Safety
            </Button>
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => {
                handleInputChange('contentFilterLevel', 'moderate');
                handleInputChange('timeLimit', '90');
                handleInputChange('safetyFeatures', ['autoModeration', 'shareNotifications']);
              }}
              iconName="Balance"
              iconPosition="left"
              iconSize={18}
              className="child-friendly-button justify-start"
            >
              Balanced Settings
            </Button>
          </div>
        </div>

        {/* Final Notice */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-1" />
            <div>
              <h4 className="font-caption font-medium text-primary mb-1">
                You Can Always Change These Settings
              </h4>
              <p className="text-sm text-primary/80">
                All safety settings can be adjusted anytime from your parental dashboard. 
                Start with stricter settings and relax them as your child grows.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onPrevious}
            iconName="ChevronLeft"
            iconPosition="left"
            iconSize={20}
            className="child-friendly-button flex-1"
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="default"
            size="lg"
            iconName="CheckCircle"
            iconPosition="right"
            iconSize={20}
            className="child-friendly-button flex-1"
          >
            Complete Setup
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SafetySettingsForm;
import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';


const ChildProfileForm = ({ formData, onFormChange, onNext, onPrevious, className = '' }) => {
  const [errors, setErrors] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(formData?.childAvatar || 'avatar1');

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.childName?.trim()) {
      newErrors.childName = 'Child\'s name is required';
    }

    if (!formData?.childAge) {
      newErrors.childAge = 'Please select your child\'s age';
    }

    if (!formData?.childGrade) {
      newErrors.childGrade = 'Please select your child\'s grade level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
    if (errors?.[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    handleInputChange('childAvatar', avatar);
  };

  const ageOptions = [
    { value: '4', label: '4 years old' },
    { value: '5', label: '5 years old' },
    { value: '6', label: '6 years old' },
    { value: '7', label: '7 years old' },
    { value: '8', label: '8 years old' },
    { value: '9', label: '9 years old' },
    { value: '10', label: '10 years old' },
    { value: '11', label: '11 years old' },
    { value: '12', label: '12 years old' }
  ];

  const gradeOptions = [
    { value: 'pre-k', label: 'Pre-K' },
    { value: 'kindergarten', label: 'Kindergarten' },
    { value: '1st', label: '1st Grade' },
    { value: '2nd', label: '2nd Grade' },
    { value: '3rd', label: '3rd Grade' },
    { value: '4th', label: '4th Grade' },
    { value: '5th', label: '5th Grade' },
    { value: '6th', label: '6th Grade' },
    { value: '7th', label: '7th Grade' }
  ];

  const avatarOptions = [
    { id: 'avatar1', name: 'Happy Bear', emoji: '🐻', color: 'from-yellow-400 to-orange-400' },
    { id: 'avatar2', name: 'Cool Cat', emoji: '🐱', color: 'from-purple-400 to-pink-400' },
    { id: 'avatar3', name: 'Friendly Dog', emoji: '🐶', color: 'from-blue-400 to-cyan-400' },
    { id: 'avatar4', name: 'Wise Owl', emoji: '🦉', color: 'from-green-400 to-teal-400' },
    { id: 'avatar5', name: 'Playful Fox', emoji: '🦊', color: 'from-red-400 to-pink-400' },
    { id: 'avatar6', name: 'Sweet Bunny', emoji: '🐰', color: 'from-pink-400 to-rose-400' }
  ];

  const interests = [
    { id: 'art', label: 'Art & Drawing', icon: 'Palette' },
    { id: 'music', label: 'Music & Songs', icon: 'Music' },
    { id: 'stories', label: 'Stories & Books', icon: 'Book' },
    { id: 'games', label: 'Games & Puzzles', icon: 'Gamepad2' },
    { id: 'science', label: 'Science & Nature', icon: 'Microscope' },
    { id: 'sports', label: 'Sports & Movement', icon: 'Zap' }
  ];

  const toggleInterest = (interestId) => {
    const currentInterests = formData?.childInterests || [];
    const newInterests = currentInterests?.includes(interestId)
      ? currentInterests?.filter(id => id !== interestId)
      : [...currentInterests, interestId];
    
    handleInputChange('childInterests', newInterests);
  };

  return (
    <div className={`bg-surface rounded-xl p-6 shadow-soft ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
          <Icon name="Baby" size={32} color="white" />
        </div>
        <h3 className="text-xl font-heading text-primary mb-2">
          Create Your Child's Profile
        </h3>
        <p className="text-text-secondary font-caption">
          Let's set up a fun and safe profile for your little one
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Child's Name */}
        <Input
          label="Child's First Name"
          type="text"
          placeholder="Emma"
          value={formData?.childName || ''}
          onChange={(e) => handleInputChange('childName', e?.target?.value)}
          error={errors?.childName}
          required
          description="This will be shown on their videos and profile"
          className="mb-4"
        />

        {/* Age and Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Child's Age"
            placeholder="Select age"
            options={ageOptions}
            value={formData?.childAge || ''}
            onChange={(value) => handleInputChange('childAge', value)}
            error={errors?.childAge}
            required
            className="mb-4"
          />

          <Select
            label="Grade Level"
            placeholder="Select grade"
            options={gradeOptions}
            value={formData?.childGrade || ''}
            onChange={(value) => handleInputChange('childGrade', value)}
            error={errors?.childGrade}
            required
            className="mb-4"
          />
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-3">
            Choose a Fun Avatar
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {avatarOptions?.map((avatar) => (
              <button
                key={avatar?.id}
                type="button"
                onClick={() => handleAvatarSelect(avatar?.id)}
                className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${avatar?.color} flex items-center justify-center text-2xl shadow-soft animate-gentle hover:scale-105 ${
                  selectedAvatar === avatar?.id ? 'ring-4 ring-primary ring-offset-2' : ''
                }`}
                title={avatar?.name}
              >
                {avatar?.emoji}
                {selectedAvatar === avatar?.id && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} color="white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-secondary font-caption mt-2">
            Your child can change this later in their profile
          </p>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-3">
            What does your child enjoy? (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {interests?.map((interest) => {
              const isSelected = (formData?.childInterests || [])?.includes(interest?.id);
              
              return (
                <button
                  key={interest?.id}
                  type="button"
                  onClick={() => toggleInterest(interest?.id)}
                  className={`p-3 rounded-lg border-2 animate-gentle hover:scale-105 ${
                    isSelected 
                      ? 'border-primary bg-primary/10 text-primary' :'border-border bg-surface hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Icon name={interest?.icon} size={20} />
                    <span className="text-xs font-caption font-medium">
                      {interest?.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-text-secondary font-caption mt-2">
            This helps us suggest age-appropriate content
          </p>
        </div>

        {/* Safety Notice */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-success mt-1" />
            <div>
              <h4 className="font-caption font-medium text-success mb-1">
                Your Child's Privacy is Protected
              </h4>
              <ul className="text-sm text-success/80 space-y-1">
                <li>• Profile is private and only visible to family</li>
                <li>• No personal information is shared publicly</li>
                <li>• All content is moderated for safety</li>
                <li>• You control all sharing and visibility settings</li>
              </ul>
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
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={20}
            className="child-friendly-button flex-1"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChildProfileForm;
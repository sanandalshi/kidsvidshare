import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EditVideoDialog = ({ isOpen, video, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: 'educational', label: 'Educational' },
    { value: 'creative', label: 'Creative' },
    { value: 'music', label: 'Music' },
    { value: 'stories', label: 'Stories' },
    { value: 'games', label: 'Games' },
    { value: 'family', label: 'Family' }
  ];

  useEffect(() => {
    if (video) {
      setFormData({
        title: video?.title || '',
        description: video?.description || '',
        category: video?.category || '',
        tags: video?.tags ? video?.tags?.join(', ') : ''
      });
      setErrors({});
    }
  }, [video]);

  if (!isOpen || !video) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData?.title?.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData?.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData?.description && formData?.description?.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedVideo = {
      ...video,
      title: formData?.title?.trim(),
      description: formData?.description?.trim(),
      category: formData?.category,
      tags: formData?.tags?.split(',')?.map(tag => tag?.trim())?.filter(tag => tag)
    };

    onSave(updatedVideo);
  };

  return (
    <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-pronounced max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl text-foreground">
              Edit Video Details
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              iconName="X"
              iconSize={20}
            />
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Video Preview */}
          <div className="bg-muted rounded-xl p-4 flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="Video" size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-caption font-medium text-foreground truncate">
                {video?.title}
              </p>
              <p className="text-sm text-text-secondary">
                {video?.views} views • {video?.uploadDate}
              </p>
            </div>
          </div>

          {/* Title */}
          <Input
            label="Video Title"
            type="text"
            value={formData?.title}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            error={errors?.title}
            placeholder="Enter a catchy title for your video"
            required
            maxLength={100}
          />

          {/* Category */}
          <Select
            label="Category"
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            error={errors?.category}
            placeholder="Choose a category"
            required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              placeholder="Tell us about your video..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-border rounded-xl bg-input text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            {errors?.description && (
              <p className="text-error text-sm font-caption mt-1">
                {errors?.description}
              </p>
            )}
            <p className="text-xs text-text-secondary font-caption mt-1">
              {formData?.description?.length}/500 characters
            </p>
          </div>

          {/* Tags */}
          <Input
            label="Tags"
            type="text"
            value={formData?.tags}
            onChange={(e) => handleInputChange('tags', e?.target?.value)}
            placeholder="fun, creative, family (separate with commas)"
            description="Add tags to help others find your video"
          />
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex space-x-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            fullWidth
            className="child-friendly-button"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
            iconSize={18}
            fullWidth
            className="child-friendly-button"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditVideoDialog;
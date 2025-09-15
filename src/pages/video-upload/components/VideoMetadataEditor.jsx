import React, { useState, useContext } from 'react';
import { UserContext } from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const VideoMetadataEditor = ({ 
  videoFile, 
  onMetadataChange, 
  onSave, 
  onCancel,
  className = '' 
}) => {
  const { userType } = useContext(UserContext);
  const [metadata, setMetadata] = useState({
    title: videoFile?.name?.replace(/\.[^/.]+$/, '') || '',
    description: '',
    category: '',
    tags: [],
    privacy: 'private',
    allowComments: true,
    ageAppropriate: true
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'educational', label: '📚 Learning & Education', description: 'Educational content' },
    { value: 'creative', label: '🎨 Arts & Crafts', description: 'Creative activities' },
    { value: 'music', label: '🎵 Music & Dance', description: 'Musical performances' },
    { value: 'stories', label: '📖 Stories & Reading', description: 'Story time videos' },
    { value: 'games', label: '🎮 Games & Activities', description: 'Fun games and activities' },
    { value: 'sports', label: '⚽ Sports & Exercise', description: 'Physical activities' },
    { value: 'cooking', label: '🍳 Cooking & Baking', description: 'Kitchen adventures' },
    { value: 'science', label: '🔬 Science & Experiments', description: 'Science exploration' },
    { value: 'nature', label: '🌿 Nature & Animals', description: 'Outdoor adventures' },
    { value: 'family', label: '👨‍👩‍👧‍👦 Family Time', description: 'Family activities' }
  ];

  const privacyOptions = [
    { value: 'private', label: '🔒 Private', description: 'Only you and parents can see' },
    { value: 'family', label: '👨‍👩‍👧‍👦 Family Only', description: 'Family members can see' },
    { value: 'friends', label: '👫 Friends', description: 'Your friends can see' },
    { value: 'public', label: '🌍 Everyone', description: 'Anyone can see (with approval)' }
  ];

  const suggestedTags = [
    'fun', 'awesome', 'creative', 'learning', 'family', 'friends', 
    'happy', 'exciting', 'cool', 'amazing', 'educational', 'entertaining'
  ];

  const handleInputChange = (field, value) => {
    const newMetadata = { ...metadata, [field]: value };
    setMetadata(newMetadata);
    onMetadataChange(newMetadata);
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !metadata?.tags?.includes(tag) && metadata?.tags?.length < 10) {
      const newTags = [...metadata?.tags, tag];
      handleInputChange('tags', newTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = metadata?.tags?.filter(tag => tag !== tagToRemove);
    handleInputChange('tags', newTags);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!metadata?.title?.trim()) {
      newErrors.title = 'Please give your video a title!';
    }
    
    if (!metadata?.category) {
      newErrors.category = 'Please choose a category!';
    }
    
    if (metadata?.description?.length > 500) {
      newErrors.description = 'Description is too long! Keep it under 500 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(metadata);
    }
  };

  return (
    <div className={`bg-surface rounded-2xl border border-border shadow-soft p-6 lg:p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Icon name="Edit3" size={20} className="text-white" />
          </div>
          <div>
            <h3 className={`font-heading text-foreground ${
              userType === 'child' ? 'text-2xl' : 'text-xl'
            }`}>
              Tell Us About Your Video! ✨
            </h3>
            <p className={`font-caption text-text-secondary ${
              userType === 'child' ? 'text-base' : 'text-sm'
            }`}>
              Add some details to make it awesome!
            </p>
          </div>
        </div>
        
        {videoFile && (
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
            <Icon name="Video" size={16} className="text-primary" />
            <span className="text-sm font-caption text-text-secondary truncate max-w-32">
              {videoFile?.name}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-6">
        {/* Video Title */}
        <div>
          <Input
            label={userType === 'child' ? "What's your video called? 🎬" : "Video Title"}
            type="text"
            placeholder={userType === 'child' ? "My awesome video!" : "Enter video title..."}
            value={metadata?.title}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            error={errors?.title}
            required
            maxLength={100}
            description={`${metadata?.title?.length}/100 characters`}
            className="mb-4"
          />
        </div>

        {/* Category Selection */}
        <div>
          <Select
            label={userType === 'child' ? "What kind of video is it? 🎯" : "Video Category"}
            options={categories}
            value={metadata?.category}
            onChange={(value) => handleInputChange('category', value)}
            placeholder={userType === 'child' ? "Pick a category!" : "Choose category..."}
            error={errors?.category}
            required
            searchable
            className="mb-4"
          />
        </div>

        {/* Description */}
        <div>
          <div className="mb-2">
            <label className={`block font-caption font-medium text-foreground ${
              userType === 'child' ? 'text-base' : 'text-sm'
            }`}>
              {userType === 'child' ? "Tell us more about it! 📝" : "Description (Optional)"}
            </label>
          </div>
          <textarea
            placeholder={userType === 'child' 
              ? "This video is about..." :"Describe your video..."
            }
            value={metadata?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            maxLength={500}
            rows={4}
            className={`w-full px-4 py-3 border border-border rounded-xl bg-input text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              userType === 'child' ? 'text-base' : 'text-sm'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs font-caption text-text-secondary">
              {metadata?.description?.length}/500 characters
            </span>
            {errors?.description && (
              <span className="text-xs font-caption text-error">
                {errors?.description}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className={`block font-caption font-medium text-foreground mb-3 ${
            userType === 'child' ? 'text-base' : 'text-sm'
          }`}>
            {userType === 'child' ? "Add some fun tags! 🏷️" : "Tags (Optional)"}
          </label>
          
          {/* Current Tags */}
          {metadata?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {metadata?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-caption"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-error animate-gentle"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add New Tag */}
          <div className="flex space-x-2 mb-3">
            <Input
              type="text"
              placeholder={userType === 'child' ? "Type a tag..." : "Add tag..."}
              value={newTag}
              onChange={(e) => setNewTag(e?.target?.value)}
              onKeyPress={(e) => {
                if (e?.key === 'Enter') {
                  e?.preventDefault();
                  handleAddTag(newTag);
                }
              }}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="default"
              onClick={() => handleAddTag(newTag)}
              disabled={!newTag || metadata?.tags?.length >= 10}
              iconName="Plus"
              iconSize={16}
            >
              Add
            </Button>
          </div>

          {/* Suggested Tags */}
          <div>
            <p className="text-xs font-caption text-text-secondary mb-2">
              Suggested tags:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags?.filter(tag => !metadata?.tags?.includes(tag))?.slice(0, 6)?.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  disabled={metadata?.tags?.length >= 10}
                  className="px-2 py-1 text-xs font-caption text-text-secondary bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground animate-gentle disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <Select
            label={userType === 'child' ? "Who can see your video? 👀" : "Privacy Settings"}
            options={privacyOptions}
            value={metadata?.privacy}
            onChange={(value) => handleInputChange('privacy', value)}
            className="mb-4"
          />
        </div>

        {/* Additional Settings */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
          <h4 className={`font-caption font-medium text-foreground ${
            userType === 'child' ? 'text-base' : 'text-sm'
          }`}>
            Extra Settings ⚙️
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={metadata?.allowComments}
                onChange={(e) => handleInputChange('allowComments', e?.target?.checked)}
                className="w-5 h-5 text-primary border-border rounded focus:ring-primary"
              />
              <span className={`font-caption text-foreground ${
                userType === 'child' ? 'text-base' : 'text-sm'
              }`}>
                {userType === 'child' ? "Let people leave nice comments 💬" : "Allow comments"}
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={metadata?.ageAppropriate}
                onChange={(e) => handleInputChange('ageAppropriate', e?.target?.checked)}
                className="w-5 h-5 text-success border-border rounded focus:ring-success"
              />
              <span className={`font-caption text-foreground ${
                userType === 'child' ? 'text-base' : 'text-sm'
              }`}>
                {userType === 'child' ? "This video is kid-friendly! ✅" : "Age-appropriate content"}
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="default"
            size={userType === 'child' ? 'xl' : 'lg'}
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
            iconSize={20}
            className={`child-friendly-button bg-gradient-to-r from-success to-primary text-white shadow-pronounced hover:shadow-medium flex-1 ${
              userType === 'child' ? 'text-xl py-4' : 'text-lg py-3'
            }`}
          >
            {userType === 'child' ? "Save My Video! 🎉" : "Save & Upload"}
          </Button>
          
          <Button
            variant="outline"
            size={userType === 'child' ? 'xl' : 'lg'}
            onClick={onCancel}
            iconName="X"
            iconPosition="left"
            iconSize={20}
            className={`child-friendly-button border-2 ${
              userType === 'child' ? 'text-xl py-4' : 'text-lg py-3'
            }`}
          >
            {userType === 'child' ? "Cancel" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoMetadataEditor;
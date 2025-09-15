import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoInfo = ({ 
  title = "My Awesome Video",
  description = "This is a fun video I made!",
  category = "creative",
  tags = [],
  uploadDate = new Date(),
  duration = "2:45",
  views = 0,
  likes = 0,
  onLike = () => {},
  onShare = () => {},
  className = ''
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const categoryConfig = {
    educational: { color: 'bg-success text-success-foreground', icon: 'GraduationCap', label: 'Learning' },
    creative: { color: 'bg-accent text-accent-foreground', icon: 'Palette', label: 'Creative' },
    music: { color: 'bg-secondary text-secondary-foreground', icon: 'Music', label: 'Music' },
    stories: { color: 'bg-warning text-warning-foreground', icon: 'Book', label: 'Stories' },
    games: { color: 'bg-error text-error-foreground', icon: 'Gamepad2', label: 'Games' },
    default: { color: 'bg-primary text-primary-foreground', icon: 'Video', label: 'Video' }
  };

  const currentCategory = categoryConfig?.[category] || categoryConfig?.default;

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(!isLiked);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })?.format(date);
  };

  const shareOptions = [
    { id: 'copy', label: 'Copy Link', icon: 'Copy', action: () => navigator.clipboard?.writeText(window.location?.href) },
    { id: 'family', label: 'Share with Family', icon: 'Users', action: () => onShare('family') },
    { id: 'friends', label: 'Share with Friends', icon: 'Heart', action: () => onShare('friends') }
  ];

  return (
    <div className={`bg-surface rounded-xl p-6 shadow-soft border border-border ${className}`}>
      {/* Title and Category */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-heading text-foreground mb-2 leading-tight">
            {title}
          </h1>
          
          <div className="flex items-center space-x-3 mb-3">
            <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-caption font-medium ${currentCategory?.color}`}>
              <Icon name={currentCategory?.icon} size={16} />
              <span>{currentCategory?.label}</span>
            </span>
            
            <div className="flex items-center space-x-4 text-text-secondary text-sm font-caption">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Eye" size={14} />
                <span>{views?.toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{formatDate(uploadDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="default"
            onClick={handleLike}
            iconName={isLiked ? "Heart" : "Heart"}
            iconPosition="left"
            iconSize={18}
            className={`child-friendly-button ${
              isLiked 
                ? 'bg-error text-error-foreground animate-pulse' 
                : 'hover:bg-error/10 hover:text-error hover:border-error'
            }`}
          >
            {likes + (isLiked ? 1 : 0)}
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="default"
              onClick={() => setShowShareMenu(!showShareMenu)}
              iconName="Share2"
              iconPosition="left"
              iconSize={18}
              className="child-friendly-button hover:bg-primary/10 hover:text-primary hover:border-primary"
            >
              Share
            </Button>

            {showShareMenu && (
              <div className="absolute top-full right-0 mt-2 bg-surface border border-border rounded-xl shadow-pronounced p-2 min-w-48 z-10 animate-scale-in">
                <div className="mb-2 px-3 py-2">
                  <p className="text-sm font-caption font-medium text-foreground">Share this video</p>
                  <p className="text-xs text-text-secondary">Only share with people you trust!</p>
                </div>
                {shareOptions?.map((option) => (
                  <Button
                    key={option?.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      option?.action();
                      setShowShareMenu(false);
                    }}
                    iconName={option?.icon}
                    iconPosition="left"
                    iconSize={16}
                    fullWidth
                    className="justify-start mb-1 hover:bg-muted"
                  >
                    {option?.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Description */}
      {description && (
        <div className="mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className={`text-text-secondary font-caption leading-relaxed ${
              !showFullDescription && description?.length > 150 ? 'line-clamp-3' : ''
            }`}>
              {description}
            </p>
            {description?.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullDescription(!showFullDescription)}
                iconName={showFullDescription ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
                iconSize={16}
                className="mt-2 text-primary hover:bg-primary/10"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </Button>
            )}
          </div>
        </div>
      )}
      {/* Tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-caption hover:bg-primary/20 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {/* Safety Reminder */}
      <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <p className="text-sm font-caption text-success font-medium">
            Remember: Only watch videos that make you feel happy and safe!
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { videoStorageService } from '../../../services/videoService';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VideoCard = ({ video, onEdit, onDelete, onShare, userRole = 'child' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  // Load thumbnail URL
  React.useEffect(() => {
    if (video?.thumbnail_path) {
      const url = videoStorageService?.getThumbnailUrl(video?.thumbnail_path);
      setThumbnailUrl(url);
    }
  }, [video?.thumbnail_path]);

  const handlePlayVideo = () => {
    navigate(`/video-player?id=${video?.id}`);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (!views) return '0 views';
    if (views >= 1000) {
      return `${(views / 1000)?.toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      educational: 'bg-success text-success-foreground',
      creative: 'bg-accent text-accent-foreground',
      music: 'bg-secondary text-secondary-foreground',
      stories: 'bg-warning text-warning-foreground',
      games: 'bg-error text-error-foreground',
      family: 'bg-primary text-primary-foreground'
    };
    return colors?.[category] || 'bg-muted text-muted-foreground';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      educational: 'BookOpen',
      creative: 'Palette',
      music: 'Music',
      stories: 'BookText',
      games: 'Gamepad',
      family: 'Users'
    };
    return icons?.[category] || 'Video';
  };

  const getRatingBadge = (rating) => {
    const badges = {
      all_ages: { text: 'All Ages', color: 'bg-green-100 text-green-800' },
      ages_3_plus: { text: '3+', color: 'bg-blue-100 text-blue-800' },
      ages_6_plus: { text: '6+', color: 'bg-yellow-100 text-yellow-800' },
      ages_12_plus: { text: '12+', color: 'bg-orange-100 text-orange-800' },
      parental_guidance: { text: 'PG', color: 'bg-red-100 text-red-800' }
    };
    return badges?.[rating] || badges?.all_ages;
  };

  const canManageVideo = user?.id === video?.uploader_id || userRole === 'admin';
  const ratingBadge = getRatingBadge(video?.content_rating);

  return (
    <div 
      className="group relative bg-surface border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-medium animate-gentle cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayVideo}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={thumbnailUrl || '/assets/images/no_image.png'}
          alt={video?.title || 'Video thumbnail'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-pronounced animate-pulse">
            <Icon name="Play" size={24} color="white" className="ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-lg text-xs font-caption font-medium">
          {formatDuration(video?.duration_seconds)}
        </div>

        {/* Category Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-caption font-medium ${getCategoryColor(video?.category)}`}>
          <Icon name={getCategoryIcon(video?.category)} size={12} className="inline mr-1" />
          {video?.category}
        </div>

        {/* Content Rating Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-caption font-medium ${ratingBadge?.color}`}>
          {ratingBadge?.text}
        </div>

        {/* Action Menu Button */}
        {canManageVideo && (
          <button
            className="absolute bottom-2 left-2 w-8 h-8 bg-surface/90 hover:bg-surface rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e?.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            <Icon name="MoreVertical" size={16} className="text-foreground" />
          </button>
        )}
      </div>
      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-heading text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {video?.title || 'Untitled Video'}
        </h3>
        
        {/* Uploader Info */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
            <Icon name="User" size={14} className="text-primary" />
          </div>
          <span className="text-sm text-text-secondary font-caption">
            {video?.uploader?.full_name || 'Unknown'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-text-secondary font-caption mb-3">
          <span>{formatViews(video?.view_count)}</span>
          <span>{formatTimeAgo(video?.created_at)}</span>
        </div>

        {/* Like Count */}
        {video?.like_count > 0 && (
          <div className="flex items-center space-x-1 mb-3">
            <Icon name="Heart" size={14} className="text-error" />
            <span className="text-sm text-text-secondary font-caption">
              {video?.like_count} likes
            </span>
          </div>
        )}

        {/* Child-friendly action buttons */}
        {userRole === 'child' && (
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                handlePlayVideo();
              }}
              iconName="Play"
              iconPosition="left"
              iconSize={16}
              className="flex-1 child-friendly-button"
            >
              Watch
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onShare?.(video);
              }}
              iconName="Share"
              iconSize={16}
              className="child-friendly-button"
            />
          </div>
        )}

        {/* Parent/Admin controls */}
        {userRole !== 'child' && (
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                handlePlayVideo();
              }}
              iconName="Play"
              iconPosition="left"
              iconSize={14}
              className="flex-1"
            >
              Watch
            </Button>
            
            {canManageVideo && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onEdit?.(video);
                  }}
                  iconName="Edit"
                  iconSize={14}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onDelete?.(video);
                  }}
                  iconName="Trash2"
                  iconSize={14}
                  className="hover:bg-error/10 hover:text-error hover:border-error"
                />
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onShare?.(video);
              }}
              iconName="Share"
              iconSize={14}
            />
          </div>
        )}
      </div>
      {/* Action Menu Dropdown */}
      {showActions && canManageVideo && (
        <div className="absolute top-12 right-2 bg-surface border border-border rounded-xl shadow-pronounced p-2 z-10 min-w-32">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onEdit?.(video);
              setShowActions(false);
            }}
            iconName="Edit"
            iconPosition="left"
            iconSize={14}
            fullWidth
            className="justify-start mb-1"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onShare?.(video);
              setShowActions(false);
            }}
            iconName="Share"
            iconPosition="left"
            iconSize={14}
            fullWidth
            className="justify-start mb-1"
          >
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onDelete?.(video);
              setShowActions(false);
            }}
            iconName="Trash2"
            iconPosition="left"
            iconSize={14}
            fullWidth
            className="justify-start text-error hover:bg-error/10"
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VideoCard = ({ video, onEdit, onDelete, onShare }) => {
  const navigate = useNavigate();
  const { userType } = useContext(UserContext);
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handlePlayVideo = () => {
    navigate(`/video-player?id=${video?.id}`);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000)?.toFixed(1)}K views`;
    }
    return `${views} views`;
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
          src={video?.thumbnail}
          alt={video?.title}
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
          {formatDuration(video?.duration)}
        </div>

        {/* Category Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-caption font-medium ${getCategoryColor(video?.category)}`}>
          <Icon name={video?.categoryIcon} size={12} className="inline mr-1" />
          {video?.category}
        </div>

        {/* Action Menu Button */}
        {userType === 'parent' && (
          <button
            className="absolute top-2 right-2 w-8 h-8 bg-surface/90 hover:bg-surface rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
          {video?.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-text-secondary font-caption mb-3">
          <span>{formatViews(video?.views)}</span>
          <span>{video?.uploadDate}</span>
        </div>

        {/* Child-friendly action buttons */}
        {userType === 'child' && (
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
                onShare(video);
              }}
              iconName="Share"
              iconSize={16}
              className="child-friendly-button"
            />
          </div>
        )}

        {/* Parent controls */}
        {userType === 'parent' && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onEdit(video);
              }}
              iconName="Edit"
              iconPosition="left"
              iconSize={14}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onShare(video);
              }}
              iconName="Share"
              iconSize={14}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onDelete(video);
              }}
              iconName="Trash2"
              iconSize={14}
              className="hover:bg-error/10 hover:text-error hover:border-error"
            />
          </div>
        )}
      </div>
      {/* Action Menu Dropdown */}
      {showActions && userType === 'parent' && (
        <div className="absolute top-12 right-2 bg-surface border border-border rounded-xl shadow-pronounced p-2 z-10 min-w-32">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onEdit(video);
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
              onShare(video);
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
              onDelete(video);
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
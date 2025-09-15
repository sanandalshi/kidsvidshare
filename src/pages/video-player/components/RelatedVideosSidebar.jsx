import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RelatedVideosSidebar = ({ 
  currentVideoId = null,
  onVideoSelect = () => {},
  className = ''
}) => {
  const navigate = useNavigate();
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const relatedVideos = [
    {
      id: 'vid-001',
      title: "My Pet Dog\'s Funny Tricks",
      thumbnail: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300",
      duration: "3:24",
      category: "creative",
      views: 156,
      uploadDate: new Date(2025, 8, 10),
      creator: "Emma (Age 8)"
    },
    {
      id: 'vid-002',
      title: "Learning Colors with Playdough",
      thumbnail: "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=300",
      duration: "5:12",
      category: "educational",
      views: 243,
      uploadDate: new Date(2025, 8, 8),
      creator: "Alex (Age 7)"
    },
    {
      id: 'vid-003',
      title: "My Favorite Song Dance",
      thumbnail: "https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&w=300",
      duration: "2:45",
      category: "music",
      views: 89,
      uploadDate: new Date(2025, 8, 12),
      creator: "Sophia (Age 9)"
    },
    {
      id: 'vid-004',
      title: "Building the Tallest Block Tower",
      thumbnail: "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=300",
      duration: "4:18",
      category: "games",
      views: 178,
      uploadDate: new Date(2025, 8, 6),
      creator: "Michael (Age 6)"
    },
    {
      id: 'vid-005',
      title: "Story Time: The Magic Garden",
      thumbnail: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300",
      duration: "6:30",
      category: "stories",
      views: 312,
      uploadDate: new Date(2025, 8, 5),
      creator: "Isabella (Age 10)"
    },
    {
      id: 'vid-006',
      title: "Drawing My Family Portrait",
      thumbnail: "https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&w=300",
      duration: "7:22",
      category: "creative",
      views: 134,
      uploadDate: new Date(2025, 8, 4),
      creator: "Liam (Age 8)"
    }
  ];

  const categoryConfig = {
    educational: { color: 'bg-success', icon: 'GraduationCap' },
    creative: { color: 'bg-accent', icon: 'Palette' },
    music: { color: 'bg-secondary', icon: 'Music' },
    stories: { color: 'bg-warning', icon: 'Book' },
    games: { color: 'bg-error', icon: 'Gamepad2' }
  };

  const handleVideoClick = (video) => {
    onVideoSelect(video);
    // In a real app, this would update the main video player
  };

  const formatViews = (views) => {
    if (views < 1000) return views?.toString();
    return `${(views / 1000)?.toFixed(1)}k`;
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className={`bg-surface rounded-xl shadow-soft border border-border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading text-foreground">More Fun Videos</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/video-gallery')}
            iconName="Grid3X3"
            iconSize={16}
            className="text-primary hover:bg-primary/10"
            title="View all videos"
          />
        </div>
        <p className="text-sm text-text-secondary font-caption mt-1">
          Videos you might enjoy watching
        </p>
      </div>
      {/* Videos List */}
      <div className="p-2 max-h-96 overflow-y-auto">
        {relatedVideos?.filter(video => video?.id !== currentVideoId)?.map((video) => {
            const categoryInfo = categoryConfig?.[video?.category] || categoryConfig?.creative;
            
            return (
              <div
                key={video?.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer animate-gentle group"
                onClick={() => handleVideoClick(video)}
                onMouseEnter={() => setHoveredVideo(video?.id)}
                onMouseLeave={() => setHoveredVideo(null)}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={video?.thumbnail}
                      alt={video?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-caption px-1 py-0.5 rounded">
                    {video?.duration}
                  </div>
                  
                  {/* Category Badge */}
                  <div className={`absolute top-1 left-1 w-3 h-3 rounded-full ${categoryInfo?.color}`} />
                  
                  {/* Play Overlay */}
                  {hoveredVideo === video?.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="Play" size={16} className="text-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-caption font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                    {video?.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-xs text-text-secondary font-caption mb-1">
                    <span>{video?.creator}</span>
                    <span>•</span>
                    <span>{formatViews(video?.views)} views</span>
                  </div>
                  
                  <div className="text-xs text-text-secondary font-caption">
                    {formatDate(video?.uploadDate)}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="default"
          onClick={() => navigate('/video-gallery')}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
          fullWidth
          className="child-friendly-button hover:bg-primary/10 hover:text-primary hover:border-primary"
        >
          See All Videos
        </Button>
      </div>
      {/* Safety Tip */}
      <div className="p-3 mx-4 mb-4 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="ShieldCheck" size={14} className="text-success mt-0.5 flex-shrink-0" />
          <p className="text-xs font-caption text-success leading-relaxed">
            All videos are checked to make sure they're safe and fun for kids!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RelatedVideosSidebar;
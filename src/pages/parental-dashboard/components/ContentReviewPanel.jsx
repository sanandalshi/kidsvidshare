import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ContentReviewPanel = ({ className = '' }) => {
  const [pendingVideos, setPendingVideos] = useState([
    {
      id: 'video-1',
      title: 'My Fun Day at the Park',
      thumbnail: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      duration: '2:34',
      uploadedBy: 'Emma',
      uploadDate: '2025-01-13',
      category: 'outdoor',
      description: `Today I went to the park with mommy and daddy! We played on the swings and I made a new friend.\nI also saw some ducks in the pond and fed them bread crumbs.`,
      tags: ['park', 'family', 'fun', 'outdoor'],
      fileSize: '45.2 MB',
      status: 'pending'
    },
    {
      id: 'video-2',
      title: 'Learning Colors with Blocks',
      thumbnail: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
      duration: '1:47',
      uploadedBy: 'Liam',
      uploadDate: '2025-01-13',
      category: 'educational',
      description: `Watch me build a colorful tower with my blocks!\nI know all the colors now: red, blue, yellow, green, and purple!`,
      tags: ['learning', 'colors', 'blocks', 'educational'],
      fileSize: '32.8 MB',
      status: 'pending'
    },
    {
      id: 'video-3',
      title: 'Singing My Favorite Song',
      thumbnail: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg',
      duration: '3:12',
      uploadedBy: 'Sophie',
      uploadDate: '2025-01-12',
      category: 'music',
      description: `This is my favorite song that I learned at school.\nI hope you like my singing! I practiced really hard.`,
      tags: ['music', 'singing', 'school', 'performance'],
      fileSize: '58.7 MB',
      status: 'pending'
    }
  ]);

  const handleApprove = (videoId) => {
    setPendingVideos(videos => 
      videos?.map(video => 
        video?.id === videoId 
          ? { ...video, status: 'approved' }
          : video
      )
    );
  };

  const handleReject = (videoId) => {
    setPendingVideos(videos => 
      videos?.map(video => 
        video?.id === videoId 
          ? { ...video, status: 'rejected' }
          : video
      )
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      outdoor: 'bg-success/10 text-success',
      educational: 'bg-primary/10 text-primary',
      music: 'bg-secondary/10 text-secondary',
      creative: 'bg-accent/10 text-accent',
      stories: 'bg-warning/10 text-warning'
    };
    return colors?.[category] || 'bg-muted text-text-secondary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      outdoor: 'TreePine',
      educational: 'GraduationCap',
      music: 'Music',
      creative: 'Palette',
      stories: 'Book'
    };
    return icons?.[category] || 'Video';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading text-foreground">
          Pending Reviews ({pendingVideos?.filter(v => v?.status === 'pending')?.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
          iconSize={16}
        >
          Refresh
        </Button>
      </div>
      {pendingVideos?.filter(video => video?.status === 'pending')?.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-xl">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <h4 className="text-lg font-heading text-foreground mb-2">
            All Caught Up!
          </h4>
          <p className="text-text-secondary font-caption">
            No videos pending review at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingVideos?.filter(video => video?.status === 'pending')?.map((video) => (
              <div
                key={video?.id}
                className="bg-surface border border-border rounded-xl p-6 shadow-soft hover:shadow-medium animate-gentle"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Video Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="relative w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={video?.thumbnail}
                        alt={video?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-caption">
                        {video?.duration}
                      </div>
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-caption font-medium ${getCategoryColor(video?.category)}`}>
                        <div className="flex items-center space-x-1">
                          <Icon name={getCategoryIcon(video?.category)} size={12} />
                          <span className="capitalize">{video?.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Video Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-lg font-heading text-foreground mb-2">
                        {video?.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary font-caption mb-3">
                        <div className="flex items-center space-x-1">
                          <Icon name="User" size={14} />
                          <span>By {video?.uploadedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Calendar" size={14} />
                          <span>{new Date(video.uploadDate)?.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="HardDrive" size={14} />
                          <span>{video?.fileSize}</span>
                        </div>
                      </div>
                      <p className="text-text-secondary font-caption leading-relaxed">
                        {video?.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {video?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-text-secondary text-xs font-caption rounded-lg"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                      <Button
                        variant="default"
                        size="default"
                        onClick={() => handleApprove(video?.id)}
                        iconName="Check"
                        iconPosition="left"
                        iconSize={18}
                        className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                      >
                        Approve Video
                      </Button>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => handleReject(video?.id)}
                        iconName="X"
                        iconPosition="left"
                        iconSize={18}
                        className="flex-1 border-error text-error hover:bg-error/10"
                      >
                        Reject Video
                      </Button>
                      <Button
                        variant="ghost"
                        size="default"
                        iconName="Eye"
                        iconSize={18}
                        className="lg:flex-shrink-0"
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ContentReviewPanel;
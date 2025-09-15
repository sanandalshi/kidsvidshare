import React from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ 
  videos = [], 
  onEdit, 
  onDelete, 
  onShare, 
  userRole = 'child' 
}) => {
  if (!videos?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-secondary font-caption">No videos to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos?.map((video) => (
        <VideoCard
          key={video?.id}
          video={video}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
          userRole={userRole}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
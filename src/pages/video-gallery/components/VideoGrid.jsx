import React, { useState, useContext } from 'react';
import { UserContext } from '../../../components/ui/Header';
import VideoCard from './VideoCard';
import EmptyState from './EmptyState';
import LoadingGrid from './LoadingGrid';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ShareDialog from './ShareDialog';
import EditVideoDialog from './EditVideoDialog';

const VideoGrid = ({ 
  videos = [], 
  loading = false, 
  hasFilters = false, 
  searchQuery = '',
  onVideoUpdate = () => {},
  onVideoDelete = () => {}
}) => {
  const { userType } = useContext(UserContext);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setShowEditDialog(true);
  };

  const handleDelete = (video) => {
    setSelectedVideo(video);
    setShowDeleteDialog(true);
  };

  const handleShare = (video) => {
    setSelectedVideo(video);
    setShowShareDialog(true);
  };

  const confirmDelete = () => {
    if (selectedVideo) {
      onVideoDelete(selectedVideo?.id);
      setShowDeleteDialog(false);
      setSelectedVideo(null);
    }
  };

  const handleVideoUpdate = (updatedVideo) => {
    onVideoUpdate(updatedVideo);
    setShowEditDialog(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return <LoadingGrid />;
  }

  if (videos?.length === 0) {
    return <EmptyState hasFilters={hasFilters} searchQuery={searchQuery} />;
  }

  return (
    <>
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8">
        {videos?.map((video) => (
          <VideoCard
            key={video?.id}
            video={video}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={handleShare}
          />
        ))}
      </div>
      {/* Dialogs */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        video={selectedVideo}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedVideo(null);
        }}
      />
      <ShareDialog
        isOpen={showShareDialog}
        video={selectedVideo}
        onClose={() => {
          setShowShareDialog(false);
          setSelectedVideo(null);
        }}
      />
      {userType === 'parent' && (
        <EditVideoDialog
          isOpen={showEditDialog}
          video={selectedVideo}
          onSave={handleVideoUpdate}
          onCancel={() => {
            setShowEditDialog(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </>
  );
};

export default VideoGrid;
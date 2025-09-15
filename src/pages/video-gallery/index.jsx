import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { videoService } from '../../services/videoService';
import VideoGrid from './components/VideoGrid';
import LoadingGrid from './components/LoadingGrid';
import EmptyState from './components/EmptyState';
import SortControls from './components/SortControls';
import FloatingUploadButton from './components/FloatingUploadButton';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import EditVideoDialog from './components/EditVideoDialog';
import ShareDialog from './components/ShareDialog';
import ContentFilterBar from '../../components/ui/ContentFilterBar';

const VideoGalleryPage = () => {
  const { user, userProfile } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and sort states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Load videos
  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const options = {
        category: selectedCategory,
        contentRating: selectedRating,
        searchTerm: searchTerm || null,
        sortBy,
        sortOrder,
        limit: 50 // Load more videos for gallery
      };

      const result = await videoService?.getPublishedVideos(options);
      setVideos(result?.videos || []);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  // Load videos on component mount and when filters change
  useEffect(() => {
    loadVideos();
  }, [selectedCategory, selectedRating, sortBy, sortOrder, searchTerm]);

  // Handle video actions
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

  const handleDeleteConfirm = async () => {
    if (!selectedVideo) return;

    try {
      await videoService?.deleteVideo(selectedVideo?.id);
      
      // Remove from local state
      setVideos(prev => prev?.filter(v => v?.id !== selectedVideo?.id));
      
      setShowDeleteDialog(false);
      setSelectedVideo(null);
    } catch (err) {
      setError(`Failed to delete video: ${err?.message}`);
    }
  };

  const handleEditSave = async (videoId, updates) => {
    try {
      const updatedVideo = await videoService?.updateVideo(videoId, updates);
      
      // Update local state
      setVideos(prev => prev?.map(v => 
        v?.id === videoId ? { ...v, ...updatedVideo } : v
      ));
      
      setShowEditDialog(false);
      setSelectedVideo(null);
    } catch (err) {
      setError(`Failed to update video: ${err?.message}`);
    }
  };

  const handleFilterChange = (filters) => {
    setSelectedCategory(filters?.category);
    setSelectedRating(filters?.rating);
    setSearchTerm(filters?.search);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Filter videos by user's age and content rating access
  const filteredVideos = videos?.filter(video => {
    if (!userProfile) return true;
    
    // Check content rating access
    return userProfile?.role === 'admin' || 
           userProfile?.role === 'parent' || 
           canViewContent(video?.content_rating, userProfile?.age);
  }) || [];

  const canViewContent = (contentRating, userAge) => {
    switch (contentRating) {
      case 'all_ages':
        return true;
      case 'ages_3_plus':
        return userAge >= 3;
      case 'ages_6_plus':
        return userAge >= 6;
      case 'ages_12_plus':
        return userAge >= 12;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Video Gallery
              </h1>
              <p className="text-sm text-text-secondary font-caption mt-1">
                {filteredVideos?.length} videos available
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex space-x-2">
              <SortControls 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            </div>
          </div>

          {/* Content Filter Bar */}
          <div className="mt-4">
            <ContentFilterBar 
              onFilterChange={handleFilterChange}
              userRole={userProfile?.role}
              userAge={userProfile?.age}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-error/10 border border-error/20 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-error flex-shrink-0"></div>
              <p className="text-error font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <LoadingGrid />
        )}

        {/* Empty State */}
        {!loading && filteredVideos?.length === 0 && (
          <EmptyState 
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onClearFilters={() => {
              setSearchTerm('');
              setSelectedCategory(null);
              setSelectedRating(null);
            }}
          />
        )}

        {/* Videos Grid */}
        {!loading && filteredVideos?.length > 0 && (
          <VideoGrid 
            videos={filteredVideos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={handleShare}
            userRole={userProfile?.role}
          />
        )}
      </div>

      {/* Floating Upload Button */}
      {user && userProfile?.role !== 'child' && (
        <FloatingUploadButton />
      )}

      {/* Dialogs */}
      {showDeleteDialog && (
        <DeleteConfirmDialog 
          video={selectedVideo}
          isOpen={showDeleteDialog}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteDialog(false);
            setSelectedVideo(null);
          }}
        />
      )}

      {showEditDialog && (
        <EditVideoDialog 
          video={selectedVideo}
          isOpen={showEditDialog}
          onSave={handleEditSave}
          onCancel={() => {
            setShowEditDialog(false);
            setSelectedVideo(null);
          }}
        />
      )}

      {showShareDialog && (
        <ShareDialog 
          video={selectedVideo}
          isOpen={showShareDialog}
          onClose={() => {
            setShowShareDialog(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
};

export default VideoGalleryPage;
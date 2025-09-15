import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { videoService, videoStorageService } from '../../services/videoService';
import VideoPlayer from './components/VideoPlayer';
import VideoInfo from './components/VideoInfo';
import RelatedVideosSidebar from './components/RelatedVideosSidebar';
import SafetyOverlay from './components/SafetyOverlay';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const VideoPlayerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const videoId = searchParams?.get('id');
  
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSafetyOverlay, setShowSafetyOverlay] = useState(false);

  // Load video data
  useEffect(() => {
    if (!videoId) {
      navigate('/video-gallery');
      return;
    }

    loadVideoData();
  }, [videoId]);

  const loadVideoData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load video metadata
      const videoData = await videoService?.getVideoById(videoId);
      setVideo(videoData);

      // Check if user can view this content
      if (!canUserViewVideo(videoData)) {
        setShowSafetyOverlay(true);
        return;
      }

      // Get signed URL for video file
      if (videoData?.file_path) {
        const signedUrl = await videoStorageService?.getVideoUrl(videoData?.file_path, 7200); // 2 hours
        setVideoUrl(signedUrl);
      }

      // Load user's reaction if authenticated
      if (user) {
        try {
          const reaction = await videoService?.getUserReaction(videoId, user?.id);
          setUserReaction(reaction);
        } catch (err) {
          // Non-critical error, user might not have reacted
          console.log('No user reaction found');
        }
      }

      // Load related videos
      const relatedData = await videoService?.getPublishedVideos({
        category: videoData?.category,
        limit: 8
      });
      
      // Filter out current video from related videos
      const filtered = relatedData?.videos?.filter(v => v?.id !== videoId) || [];
      setRelatedVideos(filtered);

      // Record view
      if (user) {
        await videoService?.recordView(videoId, user?.id);
      }

    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const canUserViewVideo = (videoData) => {
    if (!videoData || !userProfile) return false;

    // Check if video is published and approved
    if (videoData?.status !== 'published' || videoData?.approval_status !== 'approved') {
      return false;
    }

    // Check content rating vs user age
    const userAge = userProfile?.age || 0;
    switch (videoData?.content_rating) {
      case 'all_ages':
        return true;
      case 'ages_3_plus':
        return userAge >= 3 || userProfile?.role === 'parent' || userProfile?.role === 'admin';
      case 'ages_6_plus':
        return userAge >= 6 || userProfile?.role === 'parent' || userProfile?.role === 'admin';
      case 'ages_12_plus':
        return userAge >= 12 || userProfile?.role === 'parent' || userProfile?.role === 'admin';
      case 'parental_guidance':
        return userProfile?.role === 'parent' || userProfile?.role === 'admin';
      default:
        return false;
    }
  };

  const handleReaction = async (reactionType) => {
    if (!user || !video) return;

    try {
      const result = await videoService?.toggleReaction(video?.id, user?.id, reactionType);
      
      if (result?.action === 'removed') {
        setUserReaction(null);
        setVideo(prev => ({
          ...prev,
          like_count: Math.max(0, (prev?.like_count || 0) - 1)
        }));
      } else {
        setUserReaction(result?.reactionType);
        if (result?.action === 'added') {
          setVideo(prev => ({
            ...prev,
            like_count: (prev?.like_count || 0) + 1
          }));
        }
      }
    } catch (err) {
      setError(`Failed to update reaction: ${err?.message}`);
    }
  };

  const handleViewProgress = async (currentTime, duration) => {
    if (!user || !video) return;

    const watchDuration = Math.floor(currentTime);
    const completed = currentTime >= duration * 0.9; // 90% watched = completed

    try {
      await videoService?.updateViewProgress(video?.id, user?.id, watchDuration, completed);
    } catch (err) {
      console.error('Failed to update view progress:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary font-caption">Loading video...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Icon name="AlertCircle" size={64} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Video Not Found
          </h2>
          <p className="text-text-secondary font-caption mb-6">
            {error || 'The video you are looking for does not exist or has been removed.'}
          </p>
          <Button
            onClick={() => navigate('/video-gallery')}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }

  // Safety overlay for restricted content
  if (showSafetyOverlay) {
    return (
      <SafetyOverlay
        video={video}
        userProfile={userProfile}
        onClose={() => navigate('/video-gallery')}
        onParentApproval={() => {
          setShowSafetyOverlay(false);
          loadVideoData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-surface rounded-2xl overflow-hidden shadow-soft">
              {videoUrl ? (
                <VideoPlayer
                  src={videoUrl}
                  poster={video?.thumbnail_path ? 
                    videoStorageService?.getThumbnailUrl(video?.thumbnail_path) : 
                    null
                  }
                  onProgress={handleViewProgress}
                  userRole={userProfile?.role}
                  parentalControls={userProfile?.parental_controls}
                />
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="VideoOff" size={48} className="text-text-secondary mx-auto mb-2" />
                    <p className="text-text-secondary font-caption">Video not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <VideoInfo
              video={video}
              userReaction={userReaction}
              onReaction={handleReaction}
              userProfile={userProfile}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RelatedVideosSidebar
              videos={relatedVideos}
              currentVideoId={video?.id}
              userRole={userProfile?.role}
              userAge={userProfile?.age}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
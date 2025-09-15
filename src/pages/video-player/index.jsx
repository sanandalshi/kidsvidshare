import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../../components/ui/Header';
import Header from '../../components/ui/Header';
import VideoPlayer from './components/VideoPlayer';
import VideoInfo from './components/VideoInfo';
import RelatedVideosSidebar from './components/RelatedVideosSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const VideoPlayerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userType, safetyStatus } = useContext(UserContext);
  
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  // Mock video data - in real app this would come from API/props
  const mockVideos = {
    'vid-001': {
      id: 'vid-001',
      title: "My Pet Dog\'s Funny Tricks",
      description: `Watch my dog Max do amazing tricks! He can sit, roll over, play dead, and even fetch my slippers. \n\nI taught him these tricks over the summer with lots of treats and patience. Max is a Golden Retriever and he's 3 years old. \n\nDo you have a pet? What tricks can they do? Let me know in the comments!`,
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "creative",
      tags: ["pets", "dogs", "tricks", "funny", "animals"],
      uploadDate: new Date(2025, 8, 10),
      duration: "3:24",
      views: 156,
      likes: 23,
      creator: "Emma (Age 8)",
      contentWarnings: []
    },
    'vid-002': {
      id: 'vid-002',
      title: "Learning Colors with Playdough",
      description: `Let's learn colors together using colorful playdough! \n\nIn this video, I'll show you how to make different colors by mixing playdough together. We'll make purple by mixing red and blue, green by mixing yellow and blue, and orange by mixing red and yellow. \n\nThis is a fun way to learn about primary and secondary colors!`,
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      poster: "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "educational",
      tags: ["learning", "colors", "playdough", "education", "art"],
      uploadDate: new Date(2025, 8, 8),
      duration: "5:12",
      views: 243,
      likes: 45,
      creator: "Alex (Age 7)",
      contentWarnings: ["educational_content"]
    }
  };

  useEffect(() => {
    // Get video ID from URL params or default to first video
    const videoId = searchParams?.get('v') || 'vid-001';
    const video = mockVideos?.[videoId];
    
    if (video) {
      setCurrentVideo(video);
    } else {
      // If video not found, redirect to gallery
      navigate('/video-gallery');
      return;
    }
    
    setIsLoading(false);
  }, [searchParams, navigate]);

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    // Update URL without page reload
    window.history?.pushState({}, '', `/video-player?v=${video?.id}`);
  };

  const handleVideoEnd = () => {
    // Auto-play next video or show suggestions
    console.log('Video ended - could auto-play next video');
  };

  const handleLike = (isLiked) => {
    if (currentVideo) {
      setCurrentVideo(prev => ({
        ...prev,
        likes: prev?.likes + (isLiked ? 1 : -1)
      }));
    }
  };

  const handleShare = (shareType) => {
    if (shareType === 'copy') {
      navigator.clipboard?.writeText(window.location?.href);
      alert('Link copied! Share it with someone you trust.');
    } else {
      alert(`Sharing with ${shareType}! Remember to only share with people you know.`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary font-caption">Loading your video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertTriangle" size={32} className="text-error" />
            </div>
            <h2 className="text-xl font-heading text-foreground mb-2">Video Not Found</h2>
            <p className="text-text-secondary font-caption mb-4">
              Oops! We couldn't find that video.
            </p>
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate('/video-gallery')}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={18}
              className="child-friendly-button"
            >
              Back to Gallery
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="default"
            onClick={() => navigate('/video-gallery')}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={18}
            className="child-friendly-button hover:bg-muted"
          >
            Back to Videos
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player and Info - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              videoSrc={currentVideo?.videoSrc}
              poster={currentVideo?.poster}
              title={currentVideo?.title}
              contentWarnings={currentVideo?.contentWarnings}
              onVideoEnd={handleVideoEnd}
              className="w-full"
            />

            {/* Mobile Info Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowMobileInfo(!showMobileInfo)}
                iconName={showMobileInfo ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
                iconSize={18}
                fullWidth
                className="child-friendly-button"
              >
                Video Info
              </Button>
            </div>

            {/* Video Info */}
            <div className={`${showMobileInfo ? 'block' : 'hidden'} lg:block`}>
              <VideoInfo
                title={currentVideo?.title}
                description={currentVideo?.description}
                category={currentVideo?.category}
                tags={currentVideo?.tags}
                uploadDate={currentVideo?.uploadDate}
                duration={currentVideo?.duration}
                views={currentVideo?.views}
                likes={currentVideo?.likes}
                onLike={handleLike}
                onShare={handleShare}
              />
            </div>
          </div>

          {/* Related Videos Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <RelatedVideosSidebar
              currentVideoId={currentVideo?.id}
              onVideoSelect={handleVideoSelect}
              className="sticky top-6"
            />
          </div>
        </div>

        {/* Safety Footer */}
        <div className="mt-12 p-6 bg-success/10 border border-success/20 rounded-xl">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Icon name="ShieldCheck" size={24} className="text-success" />
            <h3 className="text-lg font-heading text-success">Safe Viewing</h3>
          </div>
          <div className="text-center space-y-2">
            <p className="text-success font-caption">
              All videos on KidsVidShare are checked to make sure they're safe and appropriate for children.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-success/80 font-caption">
              <div className="flex items-center space-x-1">
                <Icon name="Eye" size={14} />
                <span>Content Reviewed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} />
                <span>Parent Supervised</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Heart" size={14} />
                <span>Kid Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayerPage;
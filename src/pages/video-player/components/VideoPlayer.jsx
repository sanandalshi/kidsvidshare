import React, { useState, useRef, useEffect } from 'react';
import VideoPlayerControls from './VideoPlayerControls';
import SafetyOverlay from './SafetyOverlay';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoPlayer = ({ 
  videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  poster = "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800",
  title = "My Awesome Video",
  contentWarnings = [],
  onVideoEnd = () => {},
  className = ''
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSafetyOverlay, setShowSafetyOverlay] = useState(contentWarnings?.length > 0);
  const [hasError, setHasError] = useState(false);

  let controlsTimeout = useRef(null);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video?.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video?.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onVideoEnd();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    video?.addEventListener('loadedmetadata', handleLoadedMetadata);
    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('ended', handleEnded);
    video?.addEventListener('error', handleError);

    return () => {
      video?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('ended', handleEnded);
      video?.removeEventListener('error', handleError);
    };
  }, [onVideoEnd]);

  useEffect(() => {
    const video = videoRef?.current;
    if (video) {
      video.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const video = videoRef?.current;
    if (video) {
      video.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handlePlayPause = () => {
    const video = videoRef?.current;
    if (!video) return;

    if (isPlaying) {
      video?.pause();
    } else {
      video?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time) => {
    const video = videoRef?.current;
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };

  const handleFullscreen = () => {
    const container = containerRef?.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container?.requestFullscreen) {
        container?.requestFullscreen();
      } else if (container?.webkitRequestFullscreen) {
        container?.webkitRequestFullscreen();
      } else if (container?.msRequestFullscreen) {
        container?.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout?.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleSafetyApproval = () => {
    setShowSafetyOverlay(false);
  };

  if (hasError) {
    return (
      <div className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
        <div className="aspect-video flex items-center justify-center bg-muted">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertTriangle" size={32} className="text-error" />
            </div>
            <h3 className="text-lg font-heading text-foreground mb-2">
              Oops! Video won't play
            </h3>
            <p className="text-text-secondary font-caption mb-4">
              Don't worry, let's try something else!
            </p>
            <Button
              variant="default"
              size="lg"
              onClick={() => window.location?.reload()}
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={18}
              className="child-friendly-button"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        ref={containerRef}
        className={`relative bg-black rounded-xl overflow-hidden group ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          className="w-full aspect-video object-cover"
          preload="metadata"
          playsInline
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-caption">Loading your video...</p>
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Button
              variant="ghost"
              size="lg"
              onClick={handlePlayPause}
              iconName="Play"
              iconSize={48}
              className="w-20 h-20 bg-primary hover:bg-primary/90 text-white rounded-full shadow-pronounced hover:scale-110 animate-gentle"
              title="Play video"
            />
          </div>
        )}

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}>
          <VideoPlayerControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            volume={volume}
            onVolumeChange={handleVolumeChange}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            onFullscreen={handleFullscreen}
            playbackSpeed={playbackSpeed}
            onSpeedChange={handleSpeedChange}
          />
        </div>

        {/* Fullscreen Indicator */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-caption">
            Press ESC to exit fullscreen
          </div>
        )}
      </div>

      {/* Safety Overlay */}
      <SafetyOverlay
        isVisible={showSafetyOverlay}
        onClose={() => setShowSafetyOverlay(false)}
        onContinue={handleSafetyApproval}
        videoTitle={title}
        contentWarnings={contentWarnings}
      />
    </>
  );
};

export default VideoPlayer;
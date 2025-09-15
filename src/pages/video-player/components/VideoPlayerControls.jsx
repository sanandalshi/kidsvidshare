import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoPlayerControls = ({ 
  isPlaying = false,
  onPlayPause = () => {},
  volume = 50,
  onVolumeChange = () => {},
  currentTime = 0,
  duration = 0,
  onSeek = () => {},
  onFullscreen = () => {},
  playbackSpeed = 1,
  onSpeedChange = () => {},
  className = ''
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getVolumeIcon = () => {
    if (volume === 0) return 'VolumeX';
    if (volume < 30) return 'Volume1';
    if (volume < 70) return 'Volume2';
    return 'Volume';
  };

  const speedOptions = [
    { value: 0.5, label: '0.5x', icon: 'Turtle' },
    { value: 1, label: '1x', icon: 'Play' },
    { value: 1.25, label: '1.25x', icon: 'Rabbit' },
    { value: 1.5, label: '1.5x', icon: 'Zap' },
    { value: 2, label: '2x', icon: 'FastForward' }
  ];

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const clickX = e?.clientX - rect?.left;
    const percentage = clickX / rect?.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  return (
    <div className={`bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 ${className}`}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div 
          className="relative w-full h-3 bg-white/20 rounded-full cursor-pointer group hover:h-4 transition-all duration-200"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-200"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ left: `${progressPercentage}%`, marginLeft: '-8px' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-white text-sm font-caption">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      {/* Main Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center space-x-3">
          {/* Play/Pause */}
          <Button
            variant="ghost"
            size="lg"
            onClick={onPlayPause}
            iconName={isPlaying ? 'Pause' : 'Play'}
            iconSize={32}
            className="w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-pronounced hover:scale-110 animate-gentle"
            title={isPlaying ? 'Pause video' : 'Play video'}
          />

          {/* Volume Control */}
          <div className="relative">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              iconName={getVolumeIcon()}
              iconSize={24}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full"
              title="Volume control"
            />
            
            {showVolumeSlider && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-lg p-3 animate-scale-in">
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-white text-sm font-caption">{volume}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseInt(e?.target?.value))}
                    className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to top, var(--color-primary) 0%, var(--color-primary) ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Time Display */}
          <div className="hidden sm:flex items-center space-x-2 bg-black/40 rounded-lg px-3 py-2">
            <Icon name="Clock" size={16} className="text-white/70" />
            <span className="text-white font-caption text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Speed Control */}
          <div className="relative">
            <Button
              variant="ghost"
              size="default"
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              iconName="Gauge"
              iconSize={20}
              className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-2"
              title="Playback speed"
            >
              <span className="ml-2 font-caption">{playbackSpeed}x</span>
            </Button>

            {showSpeedMenu && (
              <div className="absolute bottom-16 right-0 bg-black/90 rounded-lg p-2 animate-scale-in min-w-32">
                {speedOptions?.map((option) => (
                  <Button
                    key={option?.value}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onSpeedChange(option?.value);
                      setShowSpeedMenu(false);
                    }}
                    iconName={option?.icon}
                    iconPosition="left"
                    iconSize={16}
                    fullWidth
                    className={`justify-start text-white hover:bg-white/20 mb-1 ${
                      playbackSpeed === option?.value ? 'bg-primary/50' : ''
                    }`}
                  >
                    {option?.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="lg"
            onClick={onFullscreen}
            iconName="Maximize"
            iconSize={20}
            className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full"
            title="Fullscreen"
          />
        </div>
      </div>
      {/* Fun Loading Animation */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="flex items-center space-x-2 bg-primary rounded-lg px-4 py-2">
            <div className="w-4 h-4 bg-white rounded-full animate-bounce" />
            <span className="text-white font-caption">Seeking...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerControls;
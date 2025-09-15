import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const UploadProgressOverlay = ({ 
  isVisible = false, 
  progress = 0, 
  fileName = '', 
  onCancel = () => {},
  onComplete = () => {},
  className = '' 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        onComplete();
      }, 2000);
    }
  }, [progress, onComplete]);

  if (!isVisible) return null;

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-primary';
    if (progress >= 50) return 'bg-warning';
    return 'bg-secondary';
  };

  const getStatusIcon = () => {
    if (progress >= 100) return 'CheckCircle';
    if (progress > 0) return 'Upload';
    return 'Clock';
  };

  const getStatusText = () => {
    if (progress >= 100) return 'Upload Complete!';
    if (progress > 0) return 'Uploading...';
    return 'Preparing upload...';
  };

  return (
    <div className={`fixed bottom-4 right-4 z-upload-progress ${className}`}>
      <div className={`bg-surface border border-border rounded-xl shadow-pronounced animate-scale-in ${
        isMinimized ? 'w-16 h-16' : 'w-80 sm:w-96'
      } transition-all duration-300`}>
        
        {/* Minimized View */}
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="w-full h-full flex items-center justify-center hover:bg-muted rounded-xl animate-gentle"
          >
            <div className="relative">
              <Icon name={getStatusIcon()} size={24} className="text-primary" />
              {progress < 100 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              )}
            </div>
          </button>
        ) : (
          /* Expanded View */
          (<div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon name={getStatusIcon()} size={20} className="text-primary" />
                <span className="font-caption font-medium text-foreground">
                  {getStatusText()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(true)}
                  iconName="Minus"
                  iconSize={16}
                  className="w-8 h-8"
                />
                {progress < 100 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCancel}
                    iconName="X"
                    iconSize={16}
                    className="w-8 h-8 hover:bg-error/10 hover:text-error"
                  />
                )}
              </div>
            </div>
            {/* File Info */}
            <div className="mb-3">
              <p className="text-sm text-text-secondary font-caption truncate">
                {fileName || 'my-awesome-video.mp4'}
              </p>
            </div>
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary font-caption">
                  Progress
                </span>
                <span className="text-xs font-caption font-medium text-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${getProgressColor()} transition-all duration-300 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {/* Status Messages */}
            {progress >= 100 ? (
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-caption font-medium">
                  Your video is ready to share!
                </span>
              </div>
            ) : progress > 0 ? (
              <div className="flex items-center space-x-2 text-primary">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-caption">
                  Uploading your awesome video...
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-text-secondary">
                <Icon name="Clock" size={16} />
                <span className="text-sm font-caption">
                  Getting everything ready...
                </span>
              </div>
            )}
            {/* Action Buttons */}
            {progress >= 100 && (
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={onComplete}
                  iconName="Eye"
                  iconPosition="left"
                  iconSize={16}
                  className="flex-1"
                >
                  View Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  iconName="Minimize2"
                  iconSize={16}
                />
              </div>
            )}
          </div>)
        )}

        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(12)]?.map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#FF6B35', '#4ECDC4', '#FFE66D', '#48BB78']?.[i % 4],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProgressOverlay;
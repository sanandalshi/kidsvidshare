import React, { useState, useCallback, useContext } from 'react';
import { UserContext } from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadDropZone = ({ onFilesSelected, isUploading, className = '' }) => {
  const { userType } = useContext(UserContext);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e?.dataTransfer?.items && e?.dataTransfer?.items?.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragOver(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e?.dataTransfer?.files);
    const videoFiles = files?.filter(file => file?.type?.startsWith('video/'));
    
    if (videoFiles?.length > 0) {
      onFilesSelected(videoFiles);
    }
  }, [onFilesSelected]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  }, [onFilesSelected]);

  const mascotMessages = [
    "Drop your awesome videos here! 🎬",
    "Let\'s share your amazing creations! ⭐",
    "Your videos will make everyone smile! 😊",
    "Time to show the world your talent! 🌟"
  ];

  const currentMessage = mascotMessages?.[Math.floor(Math.random() * mascotMessages?.length)];

  return (
    <div className={`relative ${className}`}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-4 border-dashed rounded-3xl p-8 lg:p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-primary bg-primary/10 scale-105 shadow-pronounced'
            : isUploading
            ? 'border-secondary bg-secondary/5' :'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
        } ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(6)]?.map((_, i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 rounded-full opacity-20 animate-bounce ${
                ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-success', 'bg-warning', 'bg-error']?.[i]
              }`}
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i % 2) * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {isUploading ? (
            <div className="space-y-6">
              <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl lg:text-3xl font-heading text-secondary">
                  Uploading Your Video! 🚀
                </h3>
                <p className="text-lg font-caption text-text-secondary">
                  Almost there... preparing your awesome content!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mascot Icon */}
              <div className={`w-24 h-24 lg:w-32 lg:h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                isDragOver 
                  ? 'bg-primary text-primary-foreground scale-110 shadow-pronounced' 
                  : 'bg-gradient-to-br from-primary to-secondary text-white shadow-soft hover:scale-105'
              }`}>
                <Icon 
                  name={isDragOver ? "Upload" : "Video"} 
                  size={userType === 'child' ? 48 : 40} 
                  className="animate-gentle"
                />
              </div>

              {/* Main Message */}
              <div className="space-y-3">
                <h2 className={`font-heading text-foreground ${
                  userType === 'child' ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'
                }`}>
                  {isDragOver ? "Drop it like it's hot! 🔥" : "Share Your Amazing Videos!"}
                </h2>
                <p className={`font-caption text-text-secondary ${
                  userType === 'child' ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'
                }`}>
                  {isDragOver ? "Release to upload your videos!" : currentMessage}
                </p>
              </div>

              {/* Upload Actions */}
              <div className="space-y-4">
                <input
                  type="file"
                  id="video-upload"
                  multiple
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Button
                  variant="default"
                  size={userType === 'child' ? 'xl' : 'lg'}
                  onClick={() => document.getElementById('video-upload')?.click()}
                  iconName="FolderOpen"
                  iconPosition="left"
                  iconSize={userType === 'child' ? 28 : 24}
                  className={`child-friendly-button bg-gradient-to-r from-primary to-secondary text-white shadow-pronounced hover:shadow-medium hover:scale-105 ${
                    userType === 'child' ? 'px-8 py-4 text-xl' : 'px-6 py-3 text-lg'
                  }`}
                >
                  Choose Your Videos
                </Button>

                {/* Camera Access for Mobile */}
                <div className="block sm:hidden">
                  <Button
                    variant="outline"
                    size={userType === 'child' ? 'xl' : 'lg'}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'video/*';
                      input.capture = 'environment';
                      input.onchange = (e) => {
                        const files = Array.from(e?.target?.files);
                        if (files?.length > 0) {
                          onFilesSelected(files);
                        }
                      };
                      input?.click();
                    }}
                    iconName="Camera"
                    iconPosition="left"
                    iconSize={userType === 'child' ? 28 : 24}
                    className={`child-friendly-button border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground ${
                      userType === 'child' ? 'px-8 py-4 text-xl' : 'px-6 py-3 text-lg'
                    }`}
                  >
                    Record New Video
                  </Button>
                </div>
              </div>

              {/* Drag and Drop Hint */}
              <div className="hidden lg:block">
                <div className="flex items-center justify-center space-x-3 text-text-secondary">
                  <div className="flex-1 h-px bg-border" />
                  <span className="font-caption text-sm px-4">
                    or drag and drop your videos here
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drag Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-primary/20 rounded-3xl flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center animate-pulse">
                <Icon name="Download" size={32} className="text-primary-foreground" />
              </div>
              <p className="text-xl font-heading text-primary">
                Drop your videos now! 🎯
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDropZone;
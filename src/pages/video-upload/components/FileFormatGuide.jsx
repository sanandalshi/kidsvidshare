import React, { useContext } from 'react';
import { UserContext } from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';

const FileFormatGuide = ({ className = '' }) => {
  const { userType } = useContext(UserContext);

  const supportedFormats = [
    {
      extension: 'MP4',
      icon: 'Video',
      color: 'bg-primary text-primary-foreground',
      description: 'Most popular video format',
      maxSize: '500MB',
      recommended: true
    },
    {
      extension: 'AVI',
      icon: 'Film',
      color: 'bg-secondary text-secondary-foreground',
      description: 'High quality videos',
      maxSize: '1GB',
      recommended: false
    },
    {
      extension: 'MOV',
      icon: 'Camera',
      color: 'bg-accent text-accent-foreground',
      description: 'Apple device videos',
      maxSize: '750MB',
      recommended: true
    },
    {
      extension: 'WebM',
      icon: 'Globe',
      color: 'bg-success text-success-foreground',
      description: 'Web-optimized format',
      maxSize: '400MB',
      recommended: false
    }
  ];

  const guidelines = [
    {
      icon: 'Clock',
      title: 'Video Length',
      description: 'Up to 10 minutes',
      color: 'text-primary'
    },
    {
      icon: 'Zap',
      title: 'Quality',
      description: 'HD (1080p) or lower',
      color: 'text-secondary'
    },
    {
      icon: 'Shield',
      title: 'Content',
      description: 'Kid-friendly only',
      color: 'text-success'
    },
    {
      icon: 'Heart',
      title: 'Fun Factor',
      description: 'Make it awesome!',
      color: 'text-error'
    }
  ];

  return (
    <div className={`bg-surface rounded-2xl border border-border shadow-soft p-6 lg:p-8 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center mb-4">
          <Icon name="Info" size={24} className="text-accent-foreground" />
        </div>
        <h3 className={`font-heading text-foreground mb-2 ${
          userType === 'child' ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'
        }`}>
          Video Upload Guide 📋
        </h3>
        <p className={`font-caption text-text-secondary ${
          userType === 'child' ? 'text-lg' : 'text-base'
        }`}>
          Here's what videos you can share with us!
        </p>
      </div>
      {/* Supported Formats */}
      <div className="mb-8">
        <h4 className={`font-heading text-foreground mb-4 ${
          userType === 'child' ? 'text-xl' : 'text-lg'
        }`}>
          Supported Video Types 🎬
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {supportedFormats?.map((format) => (
            <div
              key={format?.extension}
              className="relative bg-muted rounded-xl p-4 text-center hover:scale-105 animate-gentle"
            >
              {format?.recommended && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <Icon name="Star" size={12} className="text-success-foreground" />
                </div>
              )}
              
              <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-3 ${format?.color}`}>
                <Icon name={format?.icon} size={20} />
              </div>
              
              <h5 className={`font-heading text-foreground mb-1 ${
                userType === 'child' ? 'text-lg' : 'text-base'
              }`}>
                .{format?.extension}
              </h5>
              
              <p className="text-xs font-caption text-text-secondary mb-2">
                {format?.description}
              </p>
              
              <div className="text-xs font-caption text-text-secondary bg-background rounded-lg px-2 py-1">
                Max: {format?.maxSize}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Upload Guidelines */}
      <div>
        <h4 className={`font-heading text-foreground mb-4 ${
          userType === 'child' ? 'text-xl' : 'text-lg'
        }`}>
          Upload Guidelines ✨
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guidelines?.map((guideline, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-muted rounded-xl hover:bg-muted/80 animate-gentle"
            >
              <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center ${guideline?.color}`}>
                <Icon name={guideline?.icon} size={18} />
              </div>
              <div className="flex-1">
                <h6 className={`font-caption font-medium text-foreground ${
                  userType === 'child' ? 'text-base' : 'text-sm'
                }`}>
                  {guideline?.title}
                </h6>
                <p className={`font-caption text-text-secondary ${
                  userType === 'child' ? 'text-sm' : 'text-xs'
                }`}>
                  {guideline?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Fun Tip */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name="Lightbulb" size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h6 className={`font-caption font-medium text-primary mb-1 ${
              userType === 'child' ? 'text-base' : 'text-sm'
            }`}>
              Pro Tip! 💡
            </h6>
            <p className={`font-caption text-text-secondary ${
              userType === 'child' ? 'text-sm' : 'text-xs'
            }`}>
              {userType === 'child' 
                ? "Make sure your videos are fun and safe for everyone to enjoy! Ask a grown-up if you need help! 🤗"
                : "Ensure videos are appropriate for children and follow our community guidelines for the best experience."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileFormatGuide;
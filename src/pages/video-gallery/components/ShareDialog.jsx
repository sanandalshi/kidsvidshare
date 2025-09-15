import React, { useState, useContext } from 'react';
import { UserContext } from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ShareDialog = ({ isOpen, video, onClose }) => {
  const { userType } = useContext(UserContext);
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('link');

  if (!isOpen || !video) return null;

  const shareUrl = `https://kidsvid.share/watch/${video?.id}`;

  const shareOptions = [
    {
      id: 'link',
      label: 'Copy Link',
      icon: 'Link',
      color: 'bg-primary text-primary-foreground',
      description: 'Share with anyone'
    },
    {
      id: 'family',
      label: 'Family',
      icon: 'Users',
      color: 'bg-secondary text-secondary-foreground',
      description: 'Share with family members'
    },
    {
      id: 'friends',
      label: 'Friends',
      icon: 'Heart',
      color: 'bg-accent text-accent-foreground',
      description: 'Share with friends'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (method) => {
    setSelectedMethod(method);
    if (method === 'link') {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-pronounced max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl text-foreground">
              {userType === 'child' ? 'Share Your Video!' : 'Share Video'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
              iconSize={20}
            />
          </div>
        </div>

        {/* Video Preview */}
        <div className="p-6 border-b border-border">
          <div className="bg-muted rounded-xl p-4 flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="Video" size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-caption font-medium text-foreground truncate mb-1">
                {video?.title}
              </h3>
              <p className="text-sm text-text-secondary">
                {video?.views} views • {video?.uploadDate}
              </p>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-3 mb-6">
            {shareOptions?.map((option) => (
              <button
                key={option?.id}
                onClick={() => handleShare(option?.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedMethod === option?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${option?.color}`}>
                    <Icon name={option?.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-caption font-medium text-foreground">
                      {option?.label}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {option?.description}
                    </p>
                  </div>
                  {selectedMethod === option?.id && (
                    <Icon name="Check" size={20} className="text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Link Input */}
          {selectedMethod === 'link' && (
            <div className="mb-6">
              <Input
                label="Share Link"
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant={copied ? "success" : "outline"}
                size="default"
                onClick={handleCopyLink}
                iconName={copied ? "Check" : "Copy"}
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="mt-3 child-friendly-button"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          )}

          {/* Fun message for kids */}
          {userType === 'child' && (
            <div className="bg-accent/10 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🌟</span>
                <p className="font-caption font-medium text-foreground">
                  Great job creating this video!
                </p>
              </div>
              <p className="text-sm text-text-secondary">
                Ask a grown-up to help you share it with family and friends!
              </p>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="default"
            size="lg"
            onClick={onClose}
            fullWidth
            className="child-friendly-button"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
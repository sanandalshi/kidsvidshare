import React, { useContext } from 'react';
import { UserContext } from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmDialog = ({ isOpen, video, onConfirm, onCancel }) => {
  const { userType } = useContext(UserContext);

  if (!isOpen || !video) return null;

  const getDialogContent = () => {
    if (userType === 'child') {
      return {
        title: 'Delete this video?',
        message: `Are you sure you want to delete "${video?.title}"? You won't be able to watch it anymore!`,
        confirmText: 'Yes, Delete',
        cancelText: 'Keep Video',
        icon: '🗑️'
      };
    }

    return {
      title: 'Delete Video',
      message: `Are you sure you want to permanently delete "${video?.title}"? This action cannot be undone.`,
      confirmText: 'Delete Video',
      cancelText: 'Cancel',
      icon: 'Trash2'
    };
  };

  const content = getDialogContent();

  return (
    <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-pronounced max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {userType === 'child' ? (
              <span className="text-3xl">{content?.icon}</span>
            ) : (
              <Icon name={content?.icon} size={32} className="text-error" />
            )}
          </div>

          {/* Title */}
          <h2 className="font-heading text-xl lg:text-2xl text-foreground mb-3">
            {content?.title}
          </h2>

          {/* Message */}
          <p className="text-text-secondary font-caption text-base leading-relaxed">
            {content?.message}
          </p>
        </div>

        {/* Video Preview */}
        <div className="px-6 mb-6">
          <div className="bg-muted rounded-xl p-3 flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Video" size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-caption font-medium text-foreground truncate">
                {video?.title}
              </p>
              <p className="text-sm text-text-secondary">
                {video?.views} views • {video?.uploadDate}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex space-x-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            fullWidth
            className="child-friendly-button"
          >
            {content?.cancelText}
          </Button>
          <Button
            variant="destructive"
            size="lg"
            onClick={onConfirm}
            iconName={userType === 'child' ? undefined : 'Trash2'}
            iconPosition="left"
            iconSize={18}
            fullWidth
            className="child-friendly-button"
          >
            {content?.confirmText}
          </Button>
        </div>

        {/* Fun elements for kids */}
        {userType === 'child' && (
          <div className="px-6 pb-4 text-center">
            <p className="text-xs text-text-secondary font-caption">
              💡 Tip: You can always ask a grown-up to help you make a new video!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
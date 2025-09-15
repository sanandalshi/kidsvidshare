import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasFilters = false, searchQuery = '' }) => {
  const navigate = useNavigate();
  const { userType } = useContext(UserContext);

  const getEmptyStateContent = () => {
    if (searchQuery) {
      return {
        icon: 'Search',
        title: `No videos found for "${searchQuery}"`,
        message: `We couldn't find any videos matching your search. Try different keywords or check your spelling!`,
        actionText: 'Clear Search',
        actionIcon: 'X',
        onAction: () => window.location?.reload()
      };
    }

    if (hasFilters) {
      return {
        icon: 'Filter',
        title: 'No videos match your filters',
        message: 'Try removing some filters or selecting different categories to see more videos!',
        actionText: 'Clear Filters',
        actionIcon: 'RefreshCw',
        onAction: () => window.location?.reload()
      };
    }

    return {
      icon: 'Video',
      title: userType === 'child' ? 'No videos yet!' : 'Your video gallery is empty',
      message: userType === 'child' ?'Ask a grown-up to help you upload your first awesome video!' :'Start building your child\'s video collection by uploading their first video.',
      actionText: 'Upload Video',
      actionIcon: 'Upload',
      onAction: () => navigate('/video-upload')
    };
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Animated Icon */}
      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <Icon name={content?.icon} size={48} className="text-primary" />
      </div>
      {/* Title */}
      <h2 className="font-heading text-2xl lg:text-3xl text-foreground mb-4">
        {content?.title}
      </h2>
      {/* Message */}
      <p className="text-text-secondary font-caption text-lg max-w-md mb-8 leading-relaxed">
        {content?.message}
      </p>
      {/* Action Button */}
      <Button
        variant="default"
        size="lg"
        onClick={content?.onAction}
        iconName={content?.actionIcon}
        iconPosition="left"
        iconSize={20}
        className="child-friendly-button text-lg px-8 py-4"
      >
        {content?.actionText}
      </Button>
      {/* Fun decorative elements for kids */}
      {userType === 'child' && (
        <div className="mt-8 flex space-x-4">
          {['🎬', '🌟', '🎨', '🎵']?.map((emoji, index) => (
            <div
              key={index}
              className="text-2xl animate-bounce"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
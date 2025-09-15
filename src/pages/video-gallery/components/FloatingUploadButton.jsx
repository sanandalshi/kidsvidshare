import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../components/ui/Header';
import Button from '../../../components/ui/Button';


const FloatingUploadButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const { userType } = useContext(UserContext);
  const [isHovered, setIsHovered] = useState(false);

  const handleUploadClick = () => {
    navigate('/video-upload');
  };

  return (
    <div className={`fixed bottom-6 right-6 z-floating ${className}`}>
      <div className="relative">
        {/* Main Upload Button */}
        <Button
          variant="default"
          size="lg"
          onClick={handleUploadClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          iconName="Plus"
          iconSize={24}
          className={`w-16 h-16 rounded-full shadow-pronounced hover:shadow-medium animate-gentle hover:scale-110 ${
            userType === 'child' ?'bg-gradient-to-br from-primary to-secondary' :'bg-primary'
          } text-white border-4 border-surface`}
          title={userType === 'child' ? 'Add a new video!' : 'Upload video'}
        />

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-3 bg-foreground text-background px-3 py-2 rounded-lg text-sm font-caption whitespace-nowrap animate-scale-in">
            {userType === 'child' ? 'Upload New Video!' : 'Upload Video'}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
          </div>
        )}

        {/* Animated Ring for Kids */}
        {userType === 'child' && (
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
        )}

        {/* Fun Sparkles for Kids */}
        {userType === 'child' && isHovered && (
          <>
            {[...Array(4)]?.map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full animate-bounce"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </>
        )}
      </div>
      {/* Quick Actions Menu (Parent Mode) */}
      {userType === 'parent' && isHovered && (
        <div className="absolute bottom-20 right-0 flex flex-col space-y-2 animate-slide-up">
          <Button
            variant="outline"
            size="default"
            onClick={() => navigate('/video-upload')}
            iconName="Upload"
            iconPosition="left"
            iconSize={16}
            className="bg-surface shadow-soft whitespace-nowrap"
          >
            Upload Video
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={() => navigate('/parental-dashboard')}
            iconName="Settings"
            iconPosition="left"
            iconSize={16}
            className="bg-surface shadow-soft whitespace-nowrap"
          >
            Settings
          </Button>
        </div>
      )}
    </div>
  );
};

export default FloatingUploadButton;
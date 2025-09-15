import React, { useState, useContext } from 'react';
import { UserContext } from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SafetyOverlay = ({ 
  isVisible = false,
  onClose = () => {},
  onContinue = () => {},
  videoTitle = "Video",
  contentWarnings = [],
  className = ''
}) => {
  const { userType, safetyStatus } = useContext(UserContext);
  const [hasParentalApproval, setHasParentalApproval] = useState(false);
  const [showParentalCode, setShowParentalCode] = useState(false);
  const [parentalCode, setParentalCode] = useState('');

  const mockParentalCode = '1234';

  const warningTypes = {
    mild_language: {
      icon: 'MessageSquare',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      title: 'Mild Language',
      description: 'This video contains some words that might need parent guidance'
    },
    educational_content: {
      icon: 'GraduationCap',
      color: 'text-success',
      bgColor: 'bg-success/10',
      title: 'Educational Content',
      description: 'This video contains learning material that might be advanced'
    },
    creative_themes: {
      icon: 'Palette',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      title: 'Creative Themes',
      description: 'This video shows creative activities that might need supervision'
    },
    social_interaction: {
      icon: 'Users',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      title: 'Social Content',
      description: 'This video shows interactions with other people'
    }
  };

  const handleParentalCodeSubmit = () => {
    if (parentalCode === mockParentalCode) {
      setHasParentalApproval(true);
      setShowParentalCode(false);
    } else {
      alert('Incorrect code. Try: 1234');
    }
  };

  const handleContinue = () => {
    if (userType === 'parent' || hasParentalApproval || safetyStatus === 'unrestricted') {
      onContinue();
    } else {
      setShowParentalCode(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 ${className}`}>
      <div className="bg-surface rounded-2xl shadow-pronounced max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="p-6 text-center border-b border-border">
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-warning" />
          </div>
          <h2 className="text-xl font-heading text-foreground mb-2">
            Safety Check
          </h2>
          <p className="text-text-secondary font-caption">
            We want to make sure this video is right for you!
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Video Info */}
          <div className="mb-6">
            <h3 className="font-caption font-medium text-foreground mb-2">
              Video: {videoTitle}
            </h3>
            
            {contentWarnings?.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-text-secondary font-caption">
                  This video has been flagged for:
                </p>
                {contentWarnings?.map((warning, index) => {
                  const warningInfo = warningTypes?.[warning] || warningTypes?.educational_content;
                  return (
                    <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${warningInfo?.bgColor}`}>
                      <Icon name={warningInfo?.icon} size={20} className={warningInfo?.color} />
                      <div>
                        <p className={`font-caption font-medium ${warningInfo?.color}`}>
                          {warningInfo?.title}
                        </p>
                        <p className="text-sm text-text-secondary font-caption">
                          {warningInfo?.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Parental Code Input */}
          {showParentalCode && (
            <div className="mb-6 p-4 bg-muted rounded-lg animate-slide-up">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="Lock" size={16} className="text-primary" />
                <p className="font-caption font-medium text-foreground">
                  Ask a grown-up to enter the code
                </p>
              </div>
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={parentalCode}
                  onChange={(e) => setParentalCode(e?.target?.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={4}
                />
                <Button
                  variant="default"
                  size="default"
                  onClick={handleParentalCodeSubmit}
                  iconName="Check"
                  iconSize={16}
                  className="child-friendly-button"
                >
                  OK
                </Button>
              </div>
              <p className="text-xs text-text-secondary font-caption mt-2">
                Demo code: 1234
              </p>
            </div>
          )}

          {/* Safety Guidelines */}
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Heart" size={16} className="text-success mt-0.5" />
              <div>
                <p className="font-caption font-medium text-success mb-1">
                  Remember to stay safe!
                </p>
                <ul className="text-sm text-success font-caption space-y-1">
                  <li>• Only watch videos that make you feel good</li>
                  <li>• Tell a grown-up if something seems wrong</li>
                  <li>• Take breaks and play outside too!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={18}
              fullWidth
              className="child-friendly-button"
            >
              Go Back
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={handleContinue}
              iconName={hasParentalApproval || userType === 'parent' ? "Play" : "Lock"}
              iconPosition="left"
              iconSize={18}
              fullWidth
              className="child-friendly-button"
              disabled={showParentalCode && !hasParentalApproval && userType !== 'parent'}
            >
              {hasParentalApproval || userType === 'parent' ? 'Watch Video' : 'Need Permission'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center space-x-2 text-text-secondary">
            <Icon name="ShieldCheck" size={14} />
            <span className="text-xs font-caption">
              KidsVidShare keeps you safe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyOverlay;
import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const RegistrationSuccess = ({ formData, className = '' }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/parental-dashboard');
  };

  const handleExploreVideos = () => {
    navigate('/video-gallery');
  };

  const nextSteps = [
    {
      icon: 'Upload',
      title: 'Upload First Video',
      description: 'Help your child create their first video',
      action: () => navigate('/video-upload')
    },
    {
      icon: 'Eye',
      title: 'Explore Safe Content',
      description: 'Browse age-appropriate videos together',
      action: handleExploreVideos
    },
    {
      icon: 'Settings',
      title: 'Customize Settings',
      description: 'Fine-tune safety and parental controls',
      action: handleContinue
    }
  ];

  const accountSummary = [
    { label: 'Family Name', value: formData?.familyName || 'The Johnson Family' },
    { label: 'Parent Email', value: formData?.parentEmail || 'parent@example.com' },
    { label: 'Child\'s Name', value: formData?.childName || 'Emma' },
    { label: 'Child\'s Age', value: formData?.childAge ? `${formData?.childAge} years old` : '8 years old' },
    { label: 'Safety Level', value: formData?.contentFilterLevel === 'strict' ? 'Maximum Safety' : formData?.contentFilterLevel === 'moderate' ? 'Balanced' : 'Relaxed' }
  ];

  return (
    <div className={`bg-surface rounded-xl p-6 shadow-soft relative overflow-hidden ${className}`}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)]?.map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#FF6B35', '#4ECDC4', '#FFE66D', '#48BB78', '#F56565']?.[i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0'
              }}
            />
          ))}
        </div>
      )}
      {/* Success Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-pronounced animate-scale-in">
          <Icon name="CheckCircle" size={40} color="white" />
        </div>
        <h2 className="text-3xl font-heading text-primary mb-2">
          Welcome to KidsVidShare! 🎉
        </h2>
        <p className="text-lg text-text-secondary font-caption">
          Your family's safe video sharing space is ready!
        </p>
      </div>
      {/* Account Summary */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <h3 className="font-caption font-medium text-foreground mb-3 flex items-center">
          <Icon name="User" size={18} className="text-primary mr-2" />
          Account Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {accountSummary?.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-text-secondary font-caption">
                {item?.label}:
              </span>
              <span className="text-sm font-caption font-medium text-foreground">
                {item?.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Safety Features Enabled */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
        <h3 className="font-caption font-medium text-success mb-3 flex items-center">
          <Icon name="Shield" size={18} className="mr-2" />
          Safety Features Enabled
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(formData?.safetyFeatures || ['autoModeration', 'commentBlocking', 'downloadPrevention'])?.map((feature, index) => {
            const featureNames = {
              autoModeration: 'Content Moderation',
              commentBlocking: 'Comment Protection',
              downloadPrevention: 'Download Prevention',
              locationBlocking: 'Location Privacy',
              shareNotifications: 'Share Alerts',
              weeklyReports: 'Activity Reports'
            };

            return (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-sm font-caption text-success">
                  {featureNames?.[feature] || feature}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Next Steps */}
      <div className="mb-6">
        <h3 className="font-caption font-medium text-foreground mb-4 flex items-center">
          <Icon name="Compass" size={18} className="text-primary mr-2" />
          What's Next?
        </h3>
        <div className="space-y-3">
          {nextSteps?.map((step, index) => (
            <button
              key={index}
              onClick={step?.action}
              className="w-full p-4 bg-surface border border-border rounded-lg hover:border-primary hover:shadow-soft animate-gentle text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={step?.icon} size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-caption font-medium text-foreground">
                    {step?.title}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {step?.description}
                  </p>
                </div>
                <Icon name="ChevronRight" size={18} className="text-text-secondary" />
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={handleContinue}
          iconName="Settings"
          iconPosition="left"
          iconSize={20}
          className="child-friendly-button"
        >
          Go to Parental Dashboard
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={handleExploreVideos}
          iconName="Play"
          iconPosition="left"
          iconSize={20}
          className="child-friendly-button"
        >
          Start Exploring Videos
        </Button>
      </div>
      {/* Help Section */}
      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-sm text-text-secondary font-caption mb-3">
          Need help getting started?
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            variant="link"
            size="default"
            iconName="HelpCircle"
            iconPosition="left"
            iconSize={16}
            className="text-primary hover:text-primary/80"
          >
            Help Center
          </Button>
          <Button
            variant="link"
            size="default"
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
            className="text-primary hover:text-primary/80"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
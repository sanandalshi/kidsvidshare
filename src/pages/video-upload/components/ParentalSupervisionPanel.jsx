import React, { useContext, useState } from 'react';
import { UserContext } from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ParentalSupervisionPanel = ({ 
  isVisible = true,
  onApprovalChange,
  className = '' 
}) => {
  const { userType, safetyStatus } = useContext(UserContext);
  const [approvalStatus, setApprovalStatus] = useState('pending');
  const [parentalNotes, setParentalNotes] = useState('');

  const supervisionLevels = {
    supervised: {
      icon: 'ShieldCheck',
      color: 'text-success',
      bgColor: 'bg-success/10',
      title: 'Full Supervision Active',
      description: 'All uploads require parental approval before sharing'
    },
    filtered: {
      icon: 'Shield',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      title: 'Content Filtering Enabled',
      description: 'Automatic content screening with parental review'
    },
    unrestricted: {
      icon: 'ShieldAlert',
      color: 'text-error',
      bgColor: 'bg-error/10',
      title: 'Limited Restrictions',
      description: 'Basic safety checks only - increased supervision recommended'
    }
  };

  const currentLevel = supervisionLevels?.[safetyStatus] || supervisionLevels?.supervised;

  const handleApprovalChange = (status) => {
    setApprovalStatus(status);
    onApprovalChange?.(status, parentalNotes);
  };

  const contentGuidelines = [
    {
      icon: 'Heart',
      title: 'Be Kind & Respectful',
      description: 'Videos should spread joy and kindness',
      color: 'text-error'
    },
    {
      icon: 'Shield',
      title: 'Keep It Safe',
      description: 'No personal information or unsafe activities',
      color: 'text-success'
    },
    {
      icon: 'Users',
      title: 'Family Friendly',
      description: 'Content appropriate for all ages',
      color: 'text-primary'
    },
    {
      icon: 'Star',
      title: 'Have Fun!',
      description: 'Share your creativity and amazing talents',
      color: 'text-accent'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className={`bg-surface rounded-2xl border border-border shadow-soft p-6 lg:p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentLevel?.bgColor}`}>
          <Icon name={currentLevel?.icon} size={24} className={currentLevel?.color} />
        </div>
        <div>
          <h3 className={`font-heading text-foreground ${
            userType === 'child' ? 'text-2xl' : 'text-xl'
          }`}>
            {userType === 'child' ? 'Safety First! 🛡️' : 'Parental Supervision'}
          </h3>
          <p className={`font-caption text-text-secondary ${
            userType === 'child' ? 'text-base' : 'text-sm'
          }`}>
            {currentLevel?.title}
          </p>
        </div>
      </div>
      {/* Current Safety Status */}
      <div className={`p-4 rounded-xl mb-6 ${currentLevel?.bgColor}`}>
        <div className="flex items-start space-x-3">
          <Icon name={currentLevel?.icon} size={20} className={currentLevel?.color} />
          <div>
            <h4 className={`font-caption font-medium mb-1 ${currentLevel?.color} ${
              userType === 'child' ? 'text-base' : 'text-sm'
            }`}>
              {currentLevel?.title}
            </h4>
            <p className={`font-caption text-text-secondary ${
              userType === 'child' ? 'text-sm' : 'text-xs'
            }`}>
              {currentLevel?.description}
            </p>
          </div>
        </div>
      </div>
      {/* Content Guidelines */}
      <div className="mb-6">
        <h4 className={`font-heading text-foreground mb-4 ${
          userType === 'child' ? 'text-xl' : 'text-lg'
        }`}>
          {userType === 'child' ? 'Video Rules 📋' : 'Content Guidelines'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contentGuidelines?.map((guideline, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-muted rounded-xl"
            >
              <div className={`w-8 h-8 rounded-lg bg-background flex items-center justify-center ${guideline?.color} flex-shrink-0`}>
                <Icon name={guideline?.icon} size={16} />
              </div>
              <div>
                <h6 className={`font-caption font-medium text-foreground mb-1 ${
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
      {/* Parental Approval Section (Parent Mode Only) */}
      {userType === 'parent' && (
        <div className="border-t border-border pt-6">
          <h4 className="font-heading text-foreground text-lg mb-4">
            Upload Approval Status
          </h4>
          
          <div className="space-y-4">
            {/* Approval Status */}
            <div className="flex items-center space-x-3">
              <span className="font-caption text-text-secondary">Status:</span>
              <div className="flex space-x-2">
                <Button
                  variant={approvalStatus === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleApprovalChange('approved')}
                  iconName="CheckCircle"
                  iconPosition="left"
                  iconSize={16}
                  className={approvalStatus === 'approved' ? 'bg-success text-success-foreground' : ''}
                >
                  Approve
                </Button>
                <Button
                  variant={approvalStatus === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleApprovalChange('rejected')}
                  iconName="XCircle"
                  iconPosition="left"
                  iconSize={16}
                  className={approvalStatus === 'rejected' ? 'bg-error text-error-foreground' : ''}
                >
                  Reject
                </Button>
                <Button
                  variant={approvalStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleApprovalChange('pending')}
                  iconName="Clock"
                  iconPosition="left"
                  iconSize={16}
                  className={approvalStatus === 'pending' ? 'bg-warning text-warning-foreground' : ''}
                >
                  Review Later
                </Button>
              </div>
            </div>

            {/* Parental Notes */}
            <div>
              <label className="block font-caption font-medium text-foreground text-sm mb-2">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Add any notes or feedback for your child..."
                value={parentalNotes}
                onChange={(e) => setParentalNotes(e?.target?.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
              />
            </div>
          </div>
        </div>
      )}
      {/* Child-Friendly Reminder */}
      {userType === 'child' && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Heart" size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h6 className={`font-caption font-medium text-primary mb-1 ${
                userType === 'child' ? 'text-base' : 'text-sm'
              }`}>
                Remember! 💝
              </h6>
              <p className={`font-caption text-text-secondary ${
                userType === 'child' ? 'text-sm' : 'text-xs'
              }`}>
                A grown-up will check your video to make sure it's safe and awesome before sharing it with others! 
                This helps keep everyone happy and safe! 🌟
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Emergency Contact */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="HelpCircle" size={16} className="text-text-secondary" />
            <span className="text-sm font-caption text-text-secondary">
              Need help or have questions?
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            Get Help
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParentalSupervisionPanel;
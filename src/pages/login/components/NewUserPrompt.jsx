import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NewUserPrompt = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/user-registration');
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="p-6 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-xl border border-accent/20">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
          <Icon name="UserPlus" size={24} color="white" />
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xl font-heading text-foreground">
            New to KidsVidShare?
          </h3>
          <p className="text-text-secondary font-caption">
            Join thousands of families sharing precious moments safely! 
            Create your free account and start uploading videos today.
          </p>
        </div>

        {/* Benefits List */}
        <div className="space-y-2 mb-6 text-left">
          {[
            'Upload unlimited videos',
            'Safe, moderated environment',
            'Easy sharing with family',
            'Parental control features',
            'Kid-friendly interface'
          ]?.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={16} className="text-success flex-shrink-0" />
              <span className="text-sm font-caption text-text-secondary">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* Create Account Button */}
        <Button
          variant="default"
          size="lg"
          onClick={handleCreateAccount}
          fullWidth
          iconName="Sparkles"
          iconPosition="left"
          iconSize={20}
          className="child-friendly-button bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-white shadow-medium"
        >
          Create Free Account
        </Button>

        {/* Additional Info */}
        <p className="text-xs text-text-secondary font-caption mt-4">
          Setup takes less than 2 minutes • No credit card required
        </p>
      </div>
    </div>
  );
};

export default NewUserPrompt;
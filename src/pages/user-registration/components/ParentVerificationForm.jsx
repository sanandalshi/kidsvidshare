import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ParentVerificationForm = ({ formData, onFormChange, onNext, onPrevious, className = '' }) => {
  const [errors, setErrors] = useState({});
  const [verificationSent, setVerificationSent] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required for verification';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.phoneNumber?.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData?.verificationCode?.trim() && verificationSent) {
      newErrors.verificationCode = 'Please enter the verification code';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    if (!formData?.confirmParent) {
      newErrors.confirmParent = 'Please confirm you are a parent or guardian';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
    if (errors?.[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSendVerification = () => {
    if (formData?.phoneNumber?.trim()) {
      setVerificationSent(true);
      // Mock verification code sending
      setTimeout(() => {
        alert('Verification code sent! Use: 123456');
      }, 500);
    }
  };

  const safetyFeatures = [
    {
      icon: 'Shield',
      title: 'Content Moderation',
      description: 'AI-powered content filtering and human review'
    },
    {
      icon: 'Eye',
      title: 'Viewing Controls',
      description: 'Monitor and control what your children watch'
    },
    {
      icon: 'Clock',
      title: 'Time Limits',
      description: 'Set daily viewing and upload time restrictions'
    },
    {
      icon: 'Users',
      title: 'Contact Management',
      description: 'Control who can interact with your child'
    }
  ];

  return (
    <div className={`bg-surface rounded-xl p-6 shadow-soft ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
          <Icon name="ShieldCheck" size={32} color="white" />
        </div>
        <h3 className="text-xl font-heading text-primary mb-2">
          Parent Verification
        </h3>
        <p className="text-text-secondary font-caption">
          We need to verify you're a parent to ensure child safety
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Verification */}
        <div className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData?.phoneNumber || ''}
            onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
            error={errors?.phoneNumber}
            required
            description="We'll send a verification code to this number"
            className="mb-2"
          />

          {!verificationSent ? (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleSendVerification}
              disabled={!formData?.phoneNumber?.trim()}
              iconName="Send"
              iconPosition="left"
              iconSize={18}
              className="child-friendly-button"
            >
              Send Verification Code
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={18} />
                <span className="text-sm font-caption">
                  Verification code sent to {formData?.phoneNumber}
                </span>
              </div>
              
              <Input
                label="Verification Code"
                type="text"
                placeholder="Enter 6-digit code"
                value={formData?.verificationCode || ''}
                onChange={(e) => handleInputChange('verificationCode', e?.target?.value)}
                error={errors?.verificationCode}
                required
                maxLength={6}
                description="Check your phone for the 6-digit code"
              />
            </div>
          )}
        </div>

        {/* Safety Features Overview */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-caption font-medium text-foreground mb-3 flex items-center">
            <Icon name="Star" size={18} className="text-primary mr-2" />
            Safety Features You'll Get
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {safetyFeatures?.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={feature?.icon} size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-caption font-medium text-foreground">
                    {feature?.title}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {feature?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Checkboxes */}
        <div className="space-y-4">
          <Checkbox
            label="I confirm that I am a parent or legal guardian"
            description="This verification helps us ensure child safety"
            checked={formData?.confirmParent || false}
            onChange={(e) => handleInputChange('confirmParent', e?.target?.checked)}
            error={errors?.confirmParent}
            required
          />

          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            description="Please review our policies to understand how we protect your family"
            checked={formData?.agreeToTerms || false}
            onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
            error={errors?.agreeToTerms}
            required
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onPrevious}
            iconName="ChevronLeft"
            iconPosition="left"
            iconSize={20}
            className="child-friendly-button flex-1"
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="default"
            size="lg"
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={20}
            className="child-friendly-button flex-1"
          >
            Continue
          </Button>
        </div>
      </form>
      {/* Help Section */}
      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-sm text-text-secondary font-caption mb-2">
          Need help with verification?
        </p>
        <Button
          variant="link"
          size="default"
          iconName="HelpCircle"
          iconPosition="left"
          iconSize={16}
          className="text-primary hover:text-primary/80"
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default ParentVerificationForm;
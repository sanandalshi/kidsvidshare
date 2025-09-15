import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationWizard = ({ currentStep, totalSteps, onNext, onPrevious, className = '' }) => {
  const steps = [
    { id: 1, title: 'Account Basics', icon: 'User', description: 'Create your family account' },
    { id: 2, title: 'Parent Verification', icon: 'Shield', description: 'Verify your identity' },
    { id: 3, title: 'Child Profile', icon: 'Baby', description: 'Set up your child' },
    { id: 4, title: 'Safety Settings', icon: 'Lock', description: 'Configure safety features' }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'active': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={`bg-surface rounded-xl p-6 shadow-soft ${className}`}>
      {/* Progress Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-heading text-primary mb-2">
          Let's Get Started! 🎉
        </h2>
        <p className="text-text-secondary font-caption">
          Step {currentStep} of {totalSteps} - We'll help you create a safe space for your family
        </p>
      </div>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps?.map((step, index) => {
          const status = getStepStatus(step?.id);
          const isLast = index === steps?.length - 1;

          return (
            <div key={step?.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepColor(status)} shadow-soft animate-gentle`}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={20} />
                  ) : (
                    <Icon name={step?.icon} size={20} />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-caption font-medium text-foreground">
                    {step?.title}
                  </p>
                  <p className="text-xs text-text-secondary hidden sm:block">
                    {step?.description}
                  </p>
                </div>
              </div>
              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-4">
                  <div className={`h-1 rounded-full ${
                    status === 'completed' ? 'bg-success' : 'bg-muted'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={onPrevious}
          disabled={currentStep === 1}
          iconName="ChevronLeft"
          iconPosition="left"
          iconSize={20}
          className="child-friendly-button"
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {[...Array(totalSteps)]?.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button
          variant="default"
          size="lg"
          onClick={onNext}
          disabled={currentStep === totalSteps}
          iconName="ChevronRight"
          iconPosition="right"
          iconSize={20}
          className="child-friendly-button"
        >
          {currentStep === totalSteps ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default RegistrationWizard;
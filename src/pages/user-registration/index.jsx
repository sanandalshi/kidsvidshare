import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header, { UserProvider } from '../../components/ui/Header';
import RegistrationWizard from './components/RegistrationWizard';
import AccountBasicsForm from './components/AccountBasicsForm';
import ParentVerificationForm from './components/ParentVerificationForm';
import ChildProfileForm from './components/ChildProfileForm';
import SafetySettingsForm from './components/SafetySettingsForm';
import RegistrationSuccess from './components/RegistrationSuccess';
import Icon from '../../components/AppIcon';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account Basics
    familyName: '',
    parentEmail: '',
    password: '',
    confirmPassword: '',
    
    // Parent Verification
    phoneNumber: '',
    verificationCode: '',
    confirmParent: false,
    agreeToTerms: false,
    
    // Child Profile
    childName: '',
    childAge: '',
    childGrade: '',
    childAvatar: 'avatar1',
    childInterests: [],
    
    // Safety Settings
    contentFilterLevel: '',
    timeLimit: '',
    safetyFeatures: []
  });

  const totalSteps = 4;
  const isComplete = currentStep > totalSteps;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(totalSteps + 1); // Show success screen
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  const handleComplete = () => {
    // Mock registration completion
    console.log('Registration completed with data:', formData);
    setCurrentStep(totalSteps + 1);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountBasicsForm
            formData={formData}
            onFormChange={handleFormChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <ParentVerificationForm
            formData={formData}
            onFormChange={handleFormChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <ChildProfileForm
            formData={formData}
            onFormChange={handleFormChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <SafetySettingsForm
            formData={formData}
            onFormChange={handleFormChange}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
          />
        );
      default:
        return (
          <RegistrationSuccess
            formData={formData}
          />
        );
    }
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Icon name="UserPlus" size={32} color="white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading text-primary mb-2">
              Join KidsVidShare Family
            </h1>
            <p className="text-lg text-text-secondary font-caption max-w-2xl mx-auto">
              Create a safe, fun space where your family can share precious video memories together
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Progress Wizard - Only show during registration steps */}
            {!isComplete && (
              <div className="mb-8">
                <RegistrationWizard
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </div>
            )}

            {/* Current Step Content */}
            <div className="mb-8">
              {renderCurrentStep()}
            </div>

            {/* Trust Signals - Only show during registration */}
            {!isComplete && (
              <div className="bg-surface rounded-xl p-6 shadow-soft">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-heading text-primary mb-2">
                    Trusted by Families Worldwide
                  </h3>
                  <p className="text-text-secondary font-caption">
                    Join thousands of families who trust us with their precious memories
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon name="Shield" size={24} className="text-success" />
                    </div>
                    <h4 className="font-caption font-medium text-foreground mb-1">
                      COPPA Compliant
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Certified safe for children under 13
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon name="Lock" size={24} className="text-primary" />
                    </div>
                    <h4 className="font-caption font-medium text-foreground mb-1">
                      Encrypted Storage
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Your videos are secure and private
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon name="Users" size={24} className="text-secondary" />
                    </div>
                    <h4 className="font-caption font-medium text-foreground mb-1">
                      Family Focused
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Built specifically for families
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border mt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Video" size={16} color="white" />
                </div>
                <span className="text-lg font-heading text-primary">KidsVidShare</span>
              </div>
              <p className="text-sm text-text-secondary font-caption mb-4">
                Creating safe spaces for family memories since {new Date()?.getFullYear()}
              </p>
              <div className="flex justify-center space-x-6 text-sm text-text-secondary">
                <button className="hover:text-primary animate-gentle">Privacy Policy</button>
                <button className="hover:text-primary animate-gentle">Terms of Service</button>
                <button className="hover:text-primary animate-gentle">Safety Guidelines</button>
                <button className="hover:text-primary animate-gentle">Contact Us</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </UserProvider>
  );
};

export default UserRegistration;
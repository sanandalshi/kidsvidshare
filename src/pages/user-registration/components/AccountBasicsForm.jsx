import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AccountBasicsForm = ({ formData, onFormChange, onNext, className = '' }) => {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.familyName?.trim()) {
      newErrors.familyName = 'Family name is required';
    }

    if (!formData?.parentEmail?.trim()) {
      newErrors.parentEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const getPasswordStrength = () => {
    const password = formData?.password || '';
    let strength = 0;
    
    if (password?.length >= 8) strength++;
    if (/[A-Z]/?.test(password)) strength++;
    if (/[a-z]/?.test(password)) strength++;
    if (/[0-9]/?.test(password)) strength++;
    if (/[^A-Za-z0-9]/?.test(password)) strength++;

    return strength;
  };

  const getPasswordStrengthText = () => {
    let strength = getPasswordStrength();
    if (strength <= 1) return { text: 'Weak', color: 'text-error' };
    if (strength <= 3) return { text: 'Good', color: 'text-warning' };
    return { text: 'Strong', color: 'text-success' };
  };

  const passwordStrength = getPasswordStrengthText();

  return (
    <div className={`bg-surface rounded-xl p-6 shadow-soft ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
          <Icon name="Users" size={32} color="white" />
        </div>
        <h3 className="text-xl font-heading text-primary mb-2">
          Create Your Family Account
        </h3>
        <p className="text-text-secondary font-caption">
          Let's start by setting up your family's safe video sharing space
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Family Name */}
        <Input
          label="Family Name"
          type="text"
          placeholder="The Johnson Family"
          value={formData?.familyName || ''}
          onChange={(e) => handleInputChange('familyName', e?.target?.value)}
          error={errors?.familyName}
          required
          description="This will be displayed on your family's video collection"
          className="mb-4"
        />

        {/* Parent Email */}
        <Input
          label="Parent Email Address"
          type="email"
          placeholder="parent@example.com"
          value={formData?.parentEmail || ''}
          onChange={(e) => handleInputChange('parentEmail', e?.target?.value)}
          error={errors?.parentEmail}
          required
          description="We'll use this for important account notifications"
          className="mb-4"
        />

        {/* Password */}
        <div className="relative">
          <Input
            label="Create Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData?.password || ''}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
            description="Use at least 8 characters with letters, numbers, and symbols"
            className="mb-2"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            iconName={showPassword ? 'EyeOff' : 'Eye'}
            iconSize={18}
            className="absolute right-3 top-8"
            title={showPassword ? 'Hide password' : 'Show password'}
          />
          
          {/* Password Strength Indicator */}
          {formData?.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      getPasswordStrength() <= 1 ? 'bg-error w-1/5' :
                      getPasswordStrength() <= 3 ? 'bg-warning w-3/5': 'bg-success w-full'
                    }`}
                  />
                </div>
                <span className={`text-sm font-caption ${passwordStrength?.color}`}>
                  {passwordStrength?.text}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData?.confirmPassword || ''}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
          className="mb-6"
        />

        {/* Trust Signals */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-success mt-1" />
            <div>
              <h4 className="font-caption font-medium text-foreground mb-1">
                Your Family's Safety is Our Priority
              </h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• All videos are private by default</li>
                <li>• Advanced parental controls included</li>
                <li>• Content moderation and filtering</li>
                <li>• Secure, encrypted data storage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={20}
          className="child-friendly-button"
        >
          Continue to Verification
        </Button>
      </form>
      {/* Login Link */}
      <div className="text-center mt-6 pt-6 border-t border-border">
        <p className="text-text-secondary font-caption">
          Already have an account?{' '}
          <Button
            variant="link"
            size="default"
            onClick={() => window.location.href = '/login'}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Sign in here
          </Button>
        </p>
      </div>
    </div>
  );
};

export default AccountBasicsForm;
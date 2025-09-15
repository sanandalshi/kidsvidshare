import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin = () => {} }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    parent: { email: 'parent@kidsvid.com', password: 'SafeParent123!' },
    child: { email: 'kiddo@kidsvid.com', password: 'FunKid456!' },
    admin: { email: 'admin@kidsvid.com', password: 'AdminSecure789!' }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Please enter your password';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      const { email, password } = formData;
      
      // Check against mock credentials
      const isValidParent = email === mockCredentials?.parent?.email && password === mockCredentials?.parent?.password;
      const isValidChild = email === mockCredentials?.child?.email && password === mockCredentials?.child?.password;
      const isValidAdmin = email === mockCredentials?.admin?.email && password === mockCredentials?.admin?.password;
      
      if (isValidParent || isValidChild || isValidAdmin) {
        const userType = isValidParent ? 'parent' : isValidChild ? 'child' : 'admin';
        
        // Store user session
        localStorage.setItem('userSession', JSON.stringify({
          email: email,
          userType: userType,
          loginTime: new Date()?.toISOString(),
          rememberMe: formData?.rememberMe
        }));
        
        onLogin({ email, userType });
        navigate('/video-gallery');
      } else {
        setErrors({
          general: `Oops! Those login details don't match our records. Please try again or use the demo credentials:\n\nParent: ${mockCredentials?.parent?.email} / ${mockCredentials?.parent?.password}\nChild: ${mockCredentials?.child?.email} / ${mockCredentials?.child?.password}`
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    navigate('/user-registration', { state: { mode: 'reset' } });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors?.general && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-xl">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-caption text-error whitespace-pre-line">
                  {errors?.general}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          className="child-friendly-button"
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          className="child-friendly-button"
        />

        {/* Remember Me Checkbox */}
        <Checkbox
          label="Remember me on this device"
          description="Stay logged in for easier access next time"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
        />

        {/* Login Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isLoading}
          disabled={isLoading}
          fullWidth
          iconName="LogIn"
          iconPosition="left"
          iconSize={20}
          className="child-friendly-button bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={handleForgotPassword}
            iconName="HelpCircle"
            iconPosition="left"
            iconSize={16}
            className="text-text-secondary hover:text-primary"
          >
            Forgot your password?
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../../../services/authService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: authError } = await authService?.signIn(
        formData?.email, 
        formData?.password
      );

      if (authError) {
        setError(authError?.message);
        return;
      }

      if (data?.user) {
        // Navigate to gallery after successful login
        navigate('/video-gallery');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData?.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isSubmitting}
            className={error ? 'border-error' : ''}
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData?.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={isSubmitting}
            className={error ? 'border-error' : ''}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
              <p className="text-error text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || !formData?.email || !formData?.password}
          iconName={isSubmitting ? "Loader" : "LogIn"}
          iconPosition="left"
          className={isSubmitting ? 'animate-pulse' : ''}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Demo Credentials Section */}
        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Key" size={16} className="mr-2 text-primary" />
            Demo Credentials
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
              <div>
                <span className="font-medium text-success">Parent:</span>
                <span className="ml-2 text-text-secondary font-mono">parent@kidsvid.com</span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fillDemoCredentials('parent@kidsvid.com', 'SafeParent123!')}
                iconName="Copy"
                iconSize={14}
                className="text-xs"
              >
                Use
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
              <div>
                <span className="font-medium text-primary">Child:</span>
                <span className="ml-2 text-text-secondary font-mono">kiddo@kidsvid.com</span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fillDemoCredentials('kiddo@kidsvid.com', 'FunKid456!')}
                iconName="Copy"
                iconSize={14}
                className="text-xs"
              >
                Use
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
              <div>
                <span className="font-medium text-warning">Admin:</span>
                <span className="ml-2 text-text-secondary font-mono">admin@kidsvid.com</span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fillDemoCredentials('admin@kidsvid.com', 'Admin123!')}
                iconName="Copy"
                iconSize={14}
                className="text-xs"
              >
                Use
              </Button>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-3">
            Click "Use" to automatically fill the login form with demo credentials.
          </p>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/user-registration')}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
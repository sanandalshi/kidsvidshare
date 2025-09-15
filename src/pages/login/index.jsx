import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header, { UserProvider } from '../../components/ui/Header';
import LoginForm from './components/LoginForm';
import WelcomeMascot from './components/WelcomeMascot';
import SafetyBadges from './components/SafetyBadges';
import NewUserPrompt from './components/NewUserPrompt';
import Icon from '../../components/AppIcon';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const session = JSON.parse(userSession);
        if (session?.rememberMe) {
          navigate('/video-gallery');
          return;
        }
      } catch (error) {
        localStorage.removeItem('userSession');
      }
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <Icon name="Video" size={24} color="white" />
          </div>
          <p className="text-text-secondary font-caption">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
        <Header />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left Column - Welcome & Safety */}
              <div className="space-y-8">
                <WelcomeMascot />
                <SafetyBadges className="hidden lg:block" />
              </div>

              {/* Right Column - Login Form */}
              <div className="space-y-8">
                <div className="bg-surface rounded-2xl shadow-pronounced p-6 lg:p-8 border border-border">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-2xl lg:text-3xl font-heading text-primary mb-2">
                      Sign In
                    </h1>
                    <p className="text-text-secondary font-caption">
                      Welcome back to your safe video sharing space
                    </p>
                  </div>

                  {/* Login Form */}
                  <LoginForm onLogin={handleLogin} />

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-surface text-text-secondary font-caption">
                        or
                      </span>
                    </div>
                  </div>

                  {/* Demo Credentials Info */}
                  <div className="p-4 bg-muted/50 rounded-xl border border-border">
                    <div className="flex items-start space-x-3">
                      <Icon name="Info" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-caption font-medium text-foreground text-sm mb-2">
                          Demo Credentials
                        </h4>
                        <div className="space-y-1 text-xs font-caption text-text-secondary">
                          <p><strong>Parent:</strong> parent@kidsvid.com / SafeParent123!</p>
                          <p><strong>Child:</strong> kiddo@kidsvid.com / FunKid456!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New User Prompt */}
                <NewUserPrompt />

                {/* Mobile Safety Badges */}
                <SafetyBadges className="lg:hidden" />
              </div>
            </div>

            {/* Bottom Features */}
            <div className="mt-16 text-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="p-6 bg-surface rounded-xl shadow-soft border border-border">
                  <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Shield" size={20} color="white" />
                  </div>
                  <h3 className="font-heading text-foreground mb-2">Safe & Secure</h3>
                  <p className="text-sm text-text-secondary font-caption">
                    Advanced security measures protect your family's content
                  </p>
                </div>

                <div className="p-6 bg-surface rounded-xl shadow-soft border border-border">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Users" size={20} color="white" />
                  </div>
                  <h3 className="font-heading text-foreground mb-2">Family Friendly</h3>
                  <p className="text-sm text-text-secondary font-caption">
                    Designed specifically for children and parents to use together
                  </p>
                </div>

                <div className="p-6 bg-surface rounded-xl shadow-soft border border-border">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Heart" size={20} color="white" />
                  </div>
                  <h3 className="font-heading text-foreground mb-2">Made with Love</h3>
                  <p className="text-sm text-text-secondary font-caption">
                    Every feature crafted with your family's happiness in mind
                  </p>
                </div>
              </div>
            </div>
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
                <span className="font-heading text-primary text-lg">KidsVidShare</span>
              </div>
              <p className="text-sm text-text-secondary font-caption">
                © {new Date()?.getFullYear()} KidsVidShare. Making video sharing safe and fun for families.
              </p>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <span className="text-xs text-text-secondary font-caption">Privacy Policy</span>
                <span className="text-xs text-text-secondary font-caption">Terms of Service</span>
                <span className="text-xs text-text-secondary font-caption">Safety Guidelines</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </UserProvider>
  );
};

export default LoginPage;
import React, { useState, useContext, createContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

// User Context for managing child/parent mode
const UserContext = createContext({
  userType: 'child',
  setUserType: () => {},
  safetyStatus: 'supervised',
  setSafetyStatus: () => {}
});

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState('child');
  const [safetyStatus, setSafetyStatus] = useState('supervised');

  return (
    <UserContext.Provider value={{ userType, setUserType, safetyStatus, setSafetyStatus }}>
      {children}
    </UserContext.Provider>
  );
};

const Header = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType, setUserType, safetyStatus } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'My Videos',
      path: '/video-gallery',
      icon: 'Video',
      parentalRequired: false,
      tooltip: 'Browse and discover videos'
    },
    {
      label: 'Watch',
      path: '/video-player',
      icon: 'Play',
      parentalRequired: false,
      tooltip: 'Watch videos'
    },
    {
      label: 'Upload',
      path: '/video-upload',
      icon: 'Upload',
      parentalRequired: false,
      tooltip: 'Share your videos'
    },
    {
      label: 'Parent Zone',
      path: '/parental-dashboard',
      icon: 'Shield',
      parentalRequired: true,
      tooltip: 'Parental controls and oversight'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleUserTypeSwitch = () => {
    setUserType(userType === 'child' ? 'parent' : 'child');
  };

  const getSafetyStatusColor = () => {
    switch (safetyStatus) {
      case 'supervised': return 'text-success';
      case 'filtered': return 'text-warning';
      case 'unrestricted': return 'text-error';
      default: return 'text-success';
    }
  };

  const getSafetyStatusIcon = () => {
    switch (safetyStatus) {
      case 'supervised': return 'ShieldCheck';
      case 'filtered': return 'Shield';
      case 'unrestricted': return 'ShieldAlert';
      default: return 'ShieldCheck';
    }
  };

  return (
    <header className={`sticky top-0 z-navigation bg-surface shadow-soft border-b border-border ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/video-gallery')}
              className="flex items-center space-x-3 animate-gentle hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-soft">
                <Icon name="Video" size={24} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-heading text-primary">
                  KidsVidShare
                </h1>
                <p className="text-xs text-text-secondary font-caption">
                  Safe Video Fun
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              const isAccessible = !item?.parentalRequired || userType === 'parent';
              
              if (!isAccessible) return null;

              return (
                <Button
                  key={item?.path}
                  variant={isActive ? "default" : "ghost"}
                  size="lg"
                  onClick={() => handleNavigation(item?.path)}
                  iconName={item?.icon}
                  iconPosition="left"
                  iconSize={20}
                  className={`child-friendly-button ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-medium' 
                      : 'hover:bg-muted hover:text-foreground'
                  }`}
                  title={item?.tooltip}
                >
                  {item?.label}
                </Button>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Safety Status Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
              <Icon 
                name={getSafetyStatusIcon()} 
                size={16} 
                className={getSafetyStatusColor()} 
              />
              <span className={`text-sm font-caption ${getSafetyStatusColor()}`}>
                {safetyStatus === 'supervised' ? 'Safe' : 
                 safetyStatus === 'filtered' ? 'Filtered' : 'Caution'}
              </span>
            </div>

            {/* User Context Switcher */}
            <Button
              variant="outline"
              size="default"
              onClick={handleUserTypeSwitch}
              iconName={userType === 'child' ? 'Baby' : 'User'}
              iconPosition="left"
              iconSize={18}
              className="child-friendly-button border-2"
              title={`Switch to ${userType === 'child' ? 'parent' : 'child'} mode`}
            >
              <span className="hidden sm:inline">
                {userType === 'child' ? 'Kid Mode' : 'Parent Mode'}
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              iconName={mobileMenuOpen ? 'X' : 'Menu'}
              iconSize={24}
              className="lg:hidden child-friendly-button"
              title="Menu"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col space-y-2">
              {navigationItems?.map((item) => {
                const isActive = location?.pathname === item?.path;
                const isAccessible = !item?.parentalRequired || userType === 'parent';
                
                if (!isAccessible) return null;

                return (
                  <Button
                    key={item?.path}
                    variant={isActive ? "default" : "ghost"}
                    size="lg"
                    onClick={() => handleNavigation(item?.path)}
                    iconName={item?.icon}
                    iconPosition="left"
                    iconSize={20}
                    fullWidth
                    className={`child-friendly-button justify-start ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    {item?.label}
                  </Button>
                );
              })}
            </nav>

            {/* Mobile Safety Status */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getSafetyStatusIcon()} 
                    size={16} 
                    className={getSafetyStatusColor()} 
                  />
                  <span className={`text-sm font-caption ${getSafetyStatusColor()}`}>
                    Safety: {safetyStatus === 'supervised' ? 'Protected' : 
                             safetyStatus === 'filtered' ? 'Filtered' : 'Caution'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
export { UserContext };
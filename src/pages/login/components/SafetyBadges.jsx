import React from 'react';
import Icon from '../../../components/AppIcon';

const SafetyBadges = ({ className = '' }) => {
  const safetyFeatures = [
    {
      icon: 'ShieldCheck',
      title: 'Parental Controls',
      description: 'Full supervision and content management',
      color: 'text-success bg-success/10'
    },
    {
      icon: 'Lock',
      title: 'Secure Login',
      description: 'Protected with advanced encryption',
      color: 'text-primary bg-primary/10'
    },
    {
      icon: 'Eye',
      title: 'Content Monitoring',
      description: 'All videos reviewed for safety',
      color: 'text-secondary bg-secondary/10'
    },
    {
      icon: 'Users',
      title: 'Family Friendly',
      description: 'Designed for children and parents',
      color: 'text-warning bg-warning/10'
    }
  ];

  return (
    <div className={`${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-heading text-foreground mb-2">
          Your Family's Safety is Our Priority
        </h3>
        <p className="text-sm text-text-secondary font-caption">
          KidsVidShare is built with multiple layers of protection
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {safetyFeatures?.map((feature, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border border-border ${feature?.color} animate-gentle hover:scale-105`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${feature?.color}`}>
                <Icon name={feature?.icon} size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-caption font-medium text-foreground text-sm mb-1">
                  {feature?.title}
                </h4>
                <p className="text-xs text-text-secondary">
                  {feature?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-xs font-caption text-text-secondary">
              COPPA Compliant
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={16} className="text-success" />
            <span className="text-xs font-caption text-text-secondary">
              SSL Encrypted
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-xs font-caption text-text-secondary">
              Family Safe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyBadges;
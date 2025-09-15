import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeMascot = ({ className = '' }) => {
  return (
    <div className={`text-center ${className}`}>
      {/* Mascot Character */}
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-pronounced animate-bounce">
          <Icon name="Video" size={40} color="white" className="lg:w-12 lg:h-12" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-pulse" />
        <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-success rounded-full animate-pulse delay-300" />
        <div className="absolute top-1/2 -right-6 w-3 h-3 bg-warning rounded-full animate-pulse delay-500" />
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-heading text-primary">
          Welcome Back!
        </h2>
        <p className="text-text-secondary font-caption text-lg">
          Ready for more video fun? Let's get you signed in!
        </p>
      </div>

      {/* Fun Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-success/10 rounded-xl">
          <Icon name="Users" size={20} className="text-success mx-auto mb-1" />
          <p className="text-xs font-caption text-success font-medium">Safe</p>
        </div>
        <div className="text-center p-3 bg-primary/10 rounded-xl">
          <Icon name="Shield" size={20} className="text-primary mx-auto mb-1" />
          <p className="text-xs font-caption text-primary font-medium">Secure</p>
        </div>
        <div className="text-center p-3 bg-secondary/10 rounded-xl">
          <Icon name="Heart" size={20} className="text-secondary mx-auto mb-1" />
          <p className="text-xs font-caption text-secondary font-medium">Fun</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMascot;
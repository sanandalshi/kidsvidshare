import React, { useContext } from 'react';
import { UserContext } from './Header';
import Icon from '../AppIcon';

const SafetyStatusIndicator = ({ className = '' }) => {
  const { safetyStatus, setSafetyStatus, userType } = useContext(UserContext);

  const safetyLevels = [
    {
      level: 'supervised',
      label: 'Supervised',
      icon: 'ShieldCheck',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Full parental oversight active'
    },
    {
      level: 'filtered',
      label: 'Filtered',
      icon: 'Shield',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Content filtering enabled'
    },
    {
      level: 'unrestricted',
      label: 'Caution',
      icon: 'ShieldAlert',
      color: 'text-error',
      bgColor: 'bg-error/10',
      description: 'Limited restrictions active'
    }
  ];

  const currentLevel = safetyLevels?.find(level => level?.level === safetyStatus) || safetyLevels?.[0];

  const handleStatusChange = () => {
    if (userType !== 'parent') return;
    
    const currentIndex = safetyLevels?.findIndex(level => level?.level === safetyStatus);
    const nextIndex = (currentIndex + 1) % safetyLevels?.length;
    setSafetyStatus(safetyLevels?.[nextIndex]?.level);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${currentLevel?.bgColor} ${
          userType === 'parent' ? 'cursor-pointer hover:scale-105 animate-gentle' : ''
        }`}
        onClick={userType === 'parent' ? handleStatusChange : undefined}
        title={userType === 'parent' ? 'Click to change safety level' : currentLevel?.description}
      >
        <Icon 
          name={currentLevel?.icon} 
          size={16} 
          className={currentLevel?.color} 
        />
        <span className={`text-sm font-caption font-medium ${currentLevel?.color}`}>
          {currentLevel?.label}
        </span>
        {userType === 'parent' && (
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={currentLevel?.color} 
          />
        )}
      </div>
      {userType === 'child' && (
        <div className="hidden sm:block">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" title="You're safe!" />
        </div>
      )}
    </div>
  );
};

export default SafetyStatusIndicator;
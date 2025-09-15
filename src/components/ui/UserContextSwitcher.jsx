import React, { useContext } from 'react';
import { UserContext } from './Header';
import Button from './Button';


const UserContextSwitcher = ({ className = '' }) => {
  const { userType, setUserType } = useContext(UserContext);

  const handleSwitch = () => {
    setUserType(userType === 'child' ? 'parent' : 'child');
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center bg-muted rounded-xl p-1">
        <Button
          variant={userType === 'child' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setUserType('child')}
          iconName="Baby"
          iconPosition="left"
          iconSize={16}
          className={`child-friendly-button text-sm ${
            userType === 'child' ?'bg-primary text-primary-foreground shadow-soft' :'hover:bg-background'
          }`}
        >
          Kid Mode
        </Button>
        <Button
          variant={userType === 'parent' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setUserType('parent')}
          iconName="User"
          iconPosition="left"
          iconSize={16}
          className={`child-friendly-button text-sm ${
            userType === 'parent' ?'bg-secondary text-secondary-foreground shadow-soft' :'hover:bg-background'
          }`}
        >
          Parent Mode
        </Button>
      </div>
    </div>
  );
};

export default UserContextSwitcher;
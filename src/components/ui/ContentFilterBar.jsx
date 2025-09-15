import React, { useState, useContext } from 'react';
import { UserContext } from './Header';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const ContentFilterBar = ({ 
  onFilterChange = () => {},
  onSearchChange = () => {},
  className = '' 
}) => {
  const { userType } = useContext(UserContext);
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filterCategories = [
    {
      id: 'all',
      label: 'All Videos',
      icon: 'Grid3X3',
      color: 'bg-primary text-primary-foreground',
      description: 'Show all videos'
    },
    {
      id: 'educational',
      label: 'Learning',
      icon: 'GraduationCap',
      color: 'bg-success text-success-foreground',
      description: 'Educational content'
    },
    {
      id: 'creative',
      label: 'Creative',
      icon: 'Palette',
      color: 'bg-accent text-accent-foreground',
      description: 'Art and creativity'
    },
    {
      id: 'music',
      label: 'Music',
      icon: 'Music',
      color: 'bg-secondary text-secondary-foreground',
      description: 'Songs and music'
    },
    {
      id: 'stories',
      label: 'Stories',
      icon: 'Book',
      color: 'bg-warning text-warning-foreground',
      description: 'Story time videos'
    },
    {
      id: 'games',
      label: 'Games',
      icon: 'Gamepad2',
      color: 'bg-error text-error-foreground',
      description: 'Fun games and activities'
    }
  ];

  const handleFilterToggle = (filterId) => {
    let newFilters;
    
    if (filterId === 'all') {
      newFilters = ['all'];
    } else {
      newFilters = activeFilters?.includes('all') 
        ? [filterId]
        : activeFilters?.includes(filterId)
          ? activeFilters?.filter(f => f !== filterId)
          : [...activeFilters?.filter(f => f !== 'all'), filterId];
      
      if (newFilters?.length === 0) {
        newFilters = ['all'];
      }
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    const query = e?.target?.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const clearAllFilters = () => {
    setActiveFilters(['all']);
    setSearchQuery('');
    onFilterChange(['all']);
    onSearchChange('');
  };

  return (
    <div className={`bg-surface border-b border-border ${className}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Input
              type="search"
              placeholder={userType === 'child' ? "What do you want to watch?" : "Search videos..."}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 child-friendly-button"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
          </div>
        </div>

        {/* Filter Categories - Desktop */}
        <div className="hidden lg:flex items-center space-x-2 mb-2">
          {filterCategories?.map((category) => {
            const isActive = activeFilters?.includes(category?.id);
            
            return (
              <Button
                key={category?.id}
                variant={isActive ? "default" : "outline"}
                size="default"
                onClick={() => handleFilterToggle(category?.id)}
                iconName={category?.icon}
                iconPosition="left"
                iconSize={18}
                className={`child-friendly-button ${
                  isActive 
                    ? category?.color + ' shadow-soft' 
                    : 'hover:bg-muted border-2'
                }`}
                title={category?.description}
              >
                {category?.label}
              </Button>
            );
          })}
        </div>

        {/* Filter Categories - Mobile */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="default"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
              iconSize={18}
              className="child-friendly-button"
            >
              Filters ({activeFilters?.length})
            </Button>
            
            {activeFilters?.length > 1 || !activeFilters?.includes('all') ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                iconName="X"
                iconPosition="left"
                iconSize={16}
                className="text-text-secondary hover:text-foreground"
              >
                Clear
              </Button>
            ) : null}
          </div>

          {isExpanded && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-slide-up">
              {filterCategories?.map((category) => {
                const isActive = activeFilters?.includes(category?.id);
                
                return (
                  <Button
                    key={category?.id}
                    variant={isActive ? "default" : "outline"}
                    size="default"
                    onClick={() => handleFilterToggle(category?.id)}
                    iconName={category?.icon}
                    iconPosition="left"
                    iconSize={16}
                    fullWidth
                    className={`child-friendly-button text-sm ${
                      isActive 
                        ? category?.color + ' shadow-soft' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    {category?.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {(activeFilters?.length > 1 || !activeFilters?.includes('all')) && (
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-border">
            <span className="text-sm font-caption text-text-secondary">
              Active filters:
            </span>
            <div className="flex flex-wrap gap-1">
              {activeFilters?.filter(f => f !== 'all')?.map((filterId) => {
                const category = filterCategories?.find(c => c?.id === filterId);
                if (!category) return null;
                
                return (
                  <span
                    key={filterId}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-muted rounded-lg text-xs font-caption"
                  >
                    <Icon name={category?.icon} size={12} />
                    <span>{category?.label}</span>
                    <button
                      onClick={() => handleFilterToggle(filterId)}
                      className="hover:text-error animate-gentle"
                    >
                      <Icon name="X" size={10} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentFilterBar;
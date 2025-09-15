import React, { useState, useContext } from 'react';
import { UserContext } from '../../../components/ui/Header';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SortControls = ({ onSortChange, className = '' }) => {
  const { userType } = useContext(UserContext);
  const [activeSortBy, setActiveSortBy] = useState('newest');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isExpanded, setIsExpanded] = useState(false);

  const sortOptions = [
    {
      id: 'newest',
      label: userType === 'child' ? 'Newest First' : 'Date Added',
      icon: 'Calendar',
      description: 'Show newest videos first'
    },
    {
      id: 'popular',
      label: userType === 'child' ? 'Most Watched' : 'Most Popular',
      icon: 'TrendingUp',
      description: 'Show most viewed videos first'
    },
    {
      id: 'alphabetical',
      label: userType === 'child' ? 'A to Z' : 'Alphabetical',
      icon: 'ArrowUpAZ',
      description: 'Sort by title alphabetically'
    },
    {
      id: 'duration',
      label: userType === 'child' ? 'Video Length' : 'Duration',
      icon: 'Clock',
      description: 'Sort by video length'
    }
  ];

  const handleSortChange = (sortBy) => {
    let newOrder = sortOrder;
    
    // If clicking the same sort option, toggle order
    if (sortBy === activeSortBy) {
      newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      setSortOrder(newOrder);
    } else {
      // Default order for different sort types
      newOrder = sortBy === 'alphabetical' ? 'asc' : 'desc';
      setSortOrder(newOrder);
      setActiveSortBy(sortBy);
    }

    onSortChange({ sortBy, order: newOrder });
    setIsExpanded(false);
  };

  const getOrderIcon = () => {
    if (activeSortBy === 'alphabetical') {
      return sortOrder === 'asc' ? 'ArrowUpAZ' : 'ArrowDownZA';
    }
    return sortOrder === 'desc' ? 'ArrowDown' : 'ArrowUp';
  };

  const activeOption = sortOptions?.find(option => option?.id === activeSortBy);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Desktop Sort Controls */}
      <div className="hidden lg:flex items-center space-x-2">
        <span className="text-sm font-caption text-text-secondary">
          Sort by:
        </span>
        {sortOptions?.map((option) => (
          <Button
            key={option?.id}
            variant={activeSortBy === option?.id ? "default" : "outline"}
            size="default"
            onClick={() => handleSortChange(option?.id)}
            iconName={option?.icon}
            iconPosition="left"
            iconSize={16}
            className={`child-friendly-button ${
              activeSortBy === option?.id 
                ? 'bg-primary text-primary-foreground shadow-soft' 
                : 'hover:bg-muted'
            }`}
            title={option?.description}
          >
            {option?.label}
          </Button>
        ))}
        
        {/* Sort Order Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSortChange(activeSortBy)}
          iconName={getOrderIcon()}
          iconSize={18}
          className="child-friendly-button"
          title={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
        />
      </div>
      {/* Mobile Sort Controls */}
      <div className="lg:hidden relative">
        <Button
          variant="outline"
          size="default"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={activeOption?.icon}
          iconPosition="left"
          iconSize={16}
          className="child-friendly-button"
        >
          {activeOption?.label}
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="ml-2" 
          />
        </Button>

        {isExpanded && (
          <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-xl shadow-pronounced p-2 z-10 min-w-48">
            {sortOptions?.map((option) => (
              <Button
                key={option?.id}
                variant={activeSortBy === option?.id ? "default" : "ghost"}
                size="default"
                onClick={() => handleSortChange(option?.id)}
                iconName={option?.icon}
                iconPosition="left"
                iconSize={16}
                fullWidth
                className={`justify-start mb-1 ${
                  activeSortBy === option?.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                {option?.label}
                {activeSortBy === option?.id && (
                  <Icon 
                    name={getOrderIcon()} 
                    size={14} 
                    className="ml-auto" 
                  />
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
      {/* Results Count */}
      <div className="hidden sm:block text-sm font-caption text-text-secondary">
        <Icon name="Grid3X3" size={14} className="inline mr-1" />
        Showing videos
      </div>
    </div>
  );
};

export default SortControls;
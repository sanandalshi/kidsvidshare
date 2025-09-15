import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityMetrics = ({ className = '' }) => {
  const metrics = [
    {
      id: 'total-videos',
      label: 'Total Videos',
      value: 47,
      change: '+12',
      changeType: 'increase',
      icon: 'Video',
      color: 'bg-primary',
      description: 'Videos uploaded this month'
    },
    {
      id: 'watch-time',
      label: 'Watch Time',
      value: '24h 32m',
      change: '+2h 15m',
      changeType: 'increase',
      icon: 'Clock',
      color: 'bg-secondary',
      description: 'Total viewing time this week'
    },
    {
      id: 'pending-review',
      label: 'Pending Review',
      value: 3,
      change: '-2',
      changeType: 'decrease',
      icon: 'AlertCircle',
      color: 'bg-warning',
      description: 'Videos awaiting approval'
    },
    {
      id: 'safety-score',
      label: 'Safety Score',
      value: '98%',
      change: '+2%',
      changeType: 'increase',
      icon: 'Shield',
      color: 'bg-success',
      description: 'Content safety rating'
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {metrics?.map((metric) => (
        <div
          key={metric?.id}
          className="bg-surface border border-border rounded-xl p-6 shadow-soft hover:shadow-medium animate-gentle"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${metric?.color} rounded-xl flex items-center justify-center shadow-soft`}>
              <Icon name={metric?.icon} size={24} color="white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-caption ${
              metric?.changeType === 'increase' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={metric?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
              />
              <span>{metric?.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-heading text-foreground">
              {metric?.value}
            </h3>
            <p className="text-sm font-caption font-medium text-text-primary">
              {metric?.label}
            </p>
            <p className="text-xs text-text-secondary">
              {metric?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityMetrics;
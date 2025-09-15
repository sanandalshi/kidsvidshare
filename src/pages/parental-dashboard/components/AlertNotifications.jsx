import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotifications = ({ className = '' }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 'alert-1',
      type: 'content_review',
      priority: 'high',
      title: 'Video Pending Review',
      message: `Emma uploaded "My Fun Day at the Park" and it's waiting for your approval.`,
      timestamp: '2025-01-13T18:30:00',isRead: false,actionRequired: true,childName: 'Emma',relatedItem: 'video-1'
    },
    {
      id: 'alert-2',type: 'time_limit',priority: 'medium',title: 'Daily Time Limit Reached',message: `Liam has reached his daily screen time limit of 90 minutes.`,timestamp: '2025-01-13T17:45:00',isRead: false,actionRequired: false,childName: 'Liam',
      relatedItem: null
    },
    {
      id: 'alert-3',type: 'sharing_request',priority: 'high',title: 'Sharing Permission Request',message: `Sophie wants to share "My Art Project" with her friend Maya. Approval needed.`,timestamp: '2025-01-13T16:20:00',isRead: true,actionRequired: true,childName: 'Sophie',relatedItem: 'video-3'
    },
    {
      id: 'alert-4',type: 'safety_concern',priority: 'high',title: 'Content Safety Alert',message: `Automated system flagged potential inappropriate content in Emma's latest upload.`,
      timestamp: '2025-01-13T15:10:00',
      isRead: false,
      actionRequired: true,
      childName: 'Emma',
      relatedItem: 'video-2'
    },
    {
      id: 'alert-5',
      type: 'achievement',
      priority: 'low',
      title: 'Weekly Goal Achieved',
      message: `Sophie completed her weekly educational video goal! She watched 5 learning videos.`,
      timestamp: '2025-01-13T14:30:00',
      isRead: true,
      actionRequired: false,
      childName: 'Sophie',
      relatedItem: null
    }
  ]);

  const [filter, setFilter] = useState('all');

  const alertTypes = {
    content_review: {
      icon: 'Eye',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Content Review'
    },
    time_limit: {
      icon: 'Clock',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      label: 'Time Limit'
    },
    sharing_request: {
      icon: 'Share2',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      label: 'Sharing Request'
    },
    safety_concern: {
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      label: 'Safety Alert'
    },
    achievement: {
      icon: 'Trophy',
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Achievement'
    }
  };

  const priorityConfig = {
    high: { color: 'text-error', label: 'High' },
    medium: { color: 'text-warning', label: 'Medium' },
    low: { color: 'text-success', label: 'Low' }
  };

  const filters = [
    { value: 'all', label: 'All Alerts', count: notifications?.length },
    { value: 'unread', label: 'Unread', count: notifications?.filter(n => !n?.isRead)?.length },
    { value: 'action_required', label: 'Action Required', count: notifications?.filter(n => n?.actionRequired)?.length },
    { value: 'high_priority', label: 'High Priority', count: notifications?.filter(n => n?.priority === 'high')?.length }
  ];

  const filteredNotifications = notifications?.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification?.isRead;
      case 'action_required':
        return notification?.actionRequired;
      case 'high_priority':
        return notification?.priority === 'high';
      default:
        return true;
    }
  });

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications =>
      notifications?.map(notification =>
        notification?.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleDismiss = (notificationId) => {
    setNotifications(notifications =>
      notifications?.filter(notification => notification?.id !== notificationId)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications =>
      notifications?.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading text-foreground">Alert Center</h3>
          <p className="text-sm text-text-secondary font-caption">
            Stay informed about your children's activities
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          iconName="CheckCheck"
          iconPosition="left"
          iconSize={16}
        >
          Mark All Read
        </Button>
      </div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters?.map((filterOption) => (
          <Button
            key={filterOption?.value}
            variant={filter === filterOption?.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption?.value)}
            className="child-friendly-button"
          >
            {filterOption?.label}
            {filterOption?.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                filter === filterOption?.value 
                  ? 'bg-white/20 text-white' :'bg-muted text-text-secondary'
              }`}>
                {filterOption?.count}
              </span>
            )}
          </Button>
        ))}
      </div>
      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications?.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-xl">
            <Icon name="Bell" size={48} className="text-text-secondary mx-auto mb-4" />
            <h4 className="text-lg font-heading text-foreground mb-2">
              No Alerts Found
            </h4>
            <p className="text-text-secondary font-caption">
              {filter === 'all' ? "You're all caught up! No new alerts at the moment." : `No alerts match the"${filters?.find(f => f?.value === filter)?.label}" filter.`
              }
            </p>
          </div>
        ) : (
          filteredNotifications?.map((notification) => {
            const alertConfig = alertTypes?.[notification?.type];
            const priorityStyle = priorityConfig?.[notification?.priority];
            
            return (
              <div
                key={notification?.id}
                className={`bg-surface border rounded-xl p-4 shadow-soft hover:shadow-medium animate-gentle ${
                  notification?.isRead ? 'border-border' : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Alert Icon */}
                  <div className={`w-10 h-10 ${alertConfig?.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon name={alertConfig?.icon} size={18} className={alertConfig?.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className={`font-caption font-medium ${
                        notification?.isRead ? 'text-foreground' : 'text-primary'
                      }`}>
                        {notification?.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-caption ${priorityStyle?.color} bg-current/10`}>
                        {priorityStyle?.label}
                      </span>
                      {!notification?.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>

                    <p className="text-sm text-text-secondary font-caption mb-3 leading-relaxed">
                      {notification?.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-text-secondary font-caption">
                        <div className="flex items-center space-x-1">
                          <Icon name="User" size={12} />
                          <span>{notification?.childName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>{formatTimestamp(notification?.timestamp)}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg ${alertConfig?.bgColor} ${alertConfig?.color}`}>
                          {alertConfig?.label}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        {notification?.actionRequired && (
                          <Button
                            variant="default"
                            size="xs"
                            iconName="ExternalLink"
                            iconPosition="right"
                            iconSize={12}
                          >
                            Take Action
                          </Button>
                        )}
                        {!notification?.isRead && (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleMarkAsRead(notification?.id)}
                            iconName="Check"
                            iconSize={12}
                            title="Mark as read"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleDismiss(notification?.id)}
                          iconName="X"
                          iconSize={12}
                          className="hover:text-error"
                          title="Dismiss"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Quick Actions */}
      {filteredNotifications?.some(n => n?.actionRequired) && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Icon name="Zap" size={18} className="text-accent" />
            <h4 className="font-caption font-medium text-foreground">
              Quick Actions Needed
            </h4>
          </div>
          <p className="text-sm text-text-secondary font-caption mb-4">
            You have {filteredNotifications?.filter(n => n?.actionRequired)?.length} items that need your attention.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              iconSize={14}
            >
              Review Content
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Share2"
              iconPosition="left"
              iconSize={14}
            >
              Approve Sharing
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconPosition="left"
              iconSize={14}
            >
              Adjust Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertNotifications;
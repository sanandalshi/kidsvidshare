import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ActivityMetrics from './components/ActivityMetrics';
import ContentReviewPanel from './components/ContentReviewPanel';
import SafetyControlsPanel from './components/SafetyControlsPanel';
import UsageAnalytics from './components/UsageAnalytics';
import ChildProfileManager from './components/ChildProfileManager';
import AlertNotifications from './components/AlertNotifications';

const ParentalDashboard = () => {
  const navigate = useNavigate();
  const { userType, setUserType } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not in parent mode
  React.useEffect(() => {
    if (userType !== 'parent') {
      setUserType('parent');
    }
  }, [userType, setUserType]);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      description: 'Activity summary and key metrics'
    },
    {
      id: 'content-review',
      label: 'Content Review',
      icon: 'Eye',
      description: 'Videos pending approval'
    },
    {
      id: 'safety-controls',
      label: 'Safety Controls',
      icon: 'Shield',
      description: 'Manage safety settings'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      description: 'Usage patterns and insights'
    },
    {
      id: 'profiles',
      label: 'Child Profiles',
      icon: 'Users',
      description: 'Manage child accounts'
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: 'Bell',
      description: 'Notifications and alerts'
    }
  ];

  const quickActions = [
    {
      label: 'Review Pending Videos',
      description: '3 videos need approval',
      icon: 'Eye',
      color: 'bg-warning',
      action: () => setActiveTab('content-review')
    },
    {
      label: 'Check Safety Settings',
      description: 'Ensure optimal protection',
      icon: 'Shield',
      color: 'bg-success',
      action: () => setActiveTab('safety-controls')
    },
    {
      label: 'View Usage Report',
      description: 'Weekly activity summary',
      icon: 'BarChart3',
      color: 'bg-primary',
      action: () => setActiveTab('analytics')
    },
    {
      label: 'Manage Profiles',
      description: '3 active child profiles',
      icon: 'Users',
      color: 'bg-secondary',
      action: () => setActiveTab('profiles')
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <ActivityMetrics />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-heading text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions?.map((action, index) => (
                    <button
                      key={index}
                      onClick={action?.action}
                      className="w-full flex items-center space-x-4 p-4 bg-muted hover:bg-muted/80 rounded-xl animate-gentle hover:shadow-soft"
                    >
                      <div className={`w-10 h-10 ${action?.color} rounded-xl flex items-center justify-center`}>
                        <Icon name={action?.icon} size={18} color="white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-caption font-medium text-foreground">
                          {action?.label}
                        </h4>
                        <p className="text-sm text-text-secondary">
                          {action?.description}
                        </p>
                      </div>
                      <Icon name="ChevronRight" size={18} className="text-text-secondary" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-heading text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                      <Icon name="Video" size={14} color="white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-caption text-foreground">
                        Emma uploaded "My Fun Day at the Park"
                      </p>
                      <p className="text-xs text-text-secondary">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
                      <Icon name="Clock" size={14} color="white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-caption text-foreground">
                        Liam reached daily time limit
                      </p>
                      <p className="text-xs text-text-secondary">3 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <Icon name="Share2" size={14} color="white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-caption text-foreground">
                        Sophie requested sharing permission
                      </p>
                      <p className="text-xs text-text-secondary">4 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'content-review':
        return <ContentReviewPanel />;
      case 'safety-controls':
        return <SafetyControlsPanel />;
      case 'analytics':
        return <UsageAnalytics />;
      case 'profiles':
        return <ChildProfileManager />;
      case 'alerts':
        return <AlertNotifications />;
      default:
        return <ActivityMetrics />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading text-foreground">
                Parental Dashboard
              </h1>
              <p className="text-text-secondary font-caption mt-1">
                Monitor and manage your children's video activities with comprehensive oversight tools
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="default"
                onClick={() => navigate('/video-gallery')}
                iconName="ArrowLeft"
                iconPosition="left"
                iconSize={18}
              >
                Back to Gallery
              </Button>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 text-success rounded-lg">
                <Icon name="ShieldCheck" size={16} />
                <span className="text-sm font-caption font-medium">
                  Parent Mode Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-surface border border-border rounded-xl p-4 shadow-soft sticky top-24">
              <nav className="space-y-2">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left animate-gentle ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <Icon 
                      name={tab?.icon} 
                      size={18} 
                      className={activeTab === tab?.id ? 'text-primary-foreground' : 'text-text-secondary'} 
                    />
                    <div className="flex-1">
                      <div className={`font-caption font-medium ${
                        activeTab === tab?.id ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                        {tab?.label}
                      </div>
                      <div className={`text-xs ${
                        activeTab === tab?.id ? 'text-primary-foreground/80' : 'text-text-secondary'
                      }`}>
                        {tab?.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-surface border border-border rounded-xl shadow-soft">
              <div className="p-6 lg:p-8">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentalDashboard;
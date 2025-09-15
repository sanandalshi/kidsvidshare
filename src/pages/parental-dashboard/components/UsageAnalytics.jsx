import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UsageAnalytics = ({ className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const weeklyData = [
    { day: 'Mon', watchTime: 45, uploads: 2 },
    { day: 'Tue', watchTime: 32, uploads: 1 },
    { day: 'Wed', watchTime: 67, uploads: 3 },
    { day: 'Thu', watchTime: 28, uploads: 0 },
    { day: 'Fri', watchTime: 89, uploads: 4 },
    { day: 'Sat', watchTime: 156, uploads: 6 },
    { day: 'Sun', watchTime: 134, uploads: 5 }
  ];

  const monthlyData = [
    { week: 'Week 1', watchTime: 320, uploads: 12 },
    { week: 'Week 2', watchTime: 280, uploads: 8 },
    { week: 'Week 3', watchTime: 410, uploads: 15 },
    { week: 'Week 4', watchTime: 380, uploads: 11 }
  ];

  const categoryData = [
    { name: 'Educational', value: 35, color: '#48BB78' },
    { name: 'Creative', value: 25, color: '#FFE66D' },
    { name: 'Music', value: 20, color: '#4ECDC4' },
    { name: 'Stories', value: 15, color: '#ED8936' },
    { name: 'Games', value: 5, color: '#F56565' }
  ];

  const timeDistribution = [
    { hour: '9 AM', usage: 12 },
    { hour: '10 AM', usage: 18 },
    { hour: '11 AM', usage: 25 },
    { hour: '12 PM', usage: 30 },
    { hour: '1 PM', usage: 22 },
    { hour: '2 PM', usage: 15 },
    { hour: '3 PM', usage: 35 },
    { hour: '4 PM', usage: 45 },
    { hour: '5 PM', usage: 52 },
    { hour: '6 PM', usage: 38 },
    { hour: '7 PM', usage: 28 },
    { hour: '8 PM', usage: 15 }
  ];

  const currentData = selectedPeriod === 'week' ? weeklyData : monthlyData;

  const periods = [
    { value: 'week', label: 'This Week', icon: 'Calendar' },
    { value: 'month', label: 'This Month', icon: 'CalendarDays' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Period Selection */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading text-foreground">Usage Analytics</h3>
        <div className="flex items-center space-x-2">
          {periods?.map((period) => (
            <Button
              key={period?.value}
              variant={selectedPeriod === period?.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period?.value)}
              iconName={period?.icon}
              iconPosition="left"
              iconSize={16}
            >
              {period?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Watch Time & Uploads Chart */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={16} color="white" />
          </div>
          <div>
            <h4 className="font-heading text-foreground">Watch Time & Upload Activity</h4>
            <p className="text-sm text-text-secondary font-caption">
              Daily breakdown of viewing and upload patterns
            </p>
          </div>
        </div>

        <div className="w-full h-64" aria-label="Watch Time and Upload Activity Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey={selectedPeriod === 'week' ? 'day' : 'week'} 
                stroke="#718096"
                fontSize={12}
              />
              <YAxis stroke="#718096" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="watchTime" fill="#FF6B35" name="Watch Time (min)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="uploads" fill="#4ECDC4" name="Uploads" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Categories */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="PieChart" size={16} color="white" />
            </div>
            <div>
              <h4 className="font-heading text-foreground">Content Categories</h4>
              <p className="text-sm text-text-secondary font-caption">
                Breakdown by video type preferences
              </p>
            </div>
          </div>

          <div className="w-full h-64" aria-label="Content Categories Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData?.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category?.color }}
                />
                <span className="text-xs font-caption text-text-secondary">
                  {category?.name} ({category?.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Usage Hours */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={16} color="white" />
            </div>
            <div>
              <h4 className="font-heading text-foreground">Peak Usage Hours</h4>
              <p className="text-sm text-text-secondary font-caption">
                When your child is most active
              </p>
            </div>
          </div>

          <div className="w-full h-64" aria-label="Peak Usage Hours Line Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#718096"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#718096" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#ED8936" 
                  strokeWidth={3}
                  dot={{ fill: '#ED8936', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ED8936', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-soft text-center">
          <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center mx-auto mb-3">
            <Icon name="Clock" size={20} color="white" />
          </div>
          <h5 className="text-lg font-heading text-foreground">8h 32m</h5>
          <p className="text-sm text-text-secondary font-caption">Total Watch Time</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-soft text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <Icon name="Video" size={20} color="white" />
          </div>
          <h5 className="text-lg font-heading text-foreground">21</h5>
          <p className="text-sm text-text-secondary font-caption">Videos Uploaded</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-soft text-center">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
            <Icon name="Heart" size={20} color="white" />
          </div>
          <h5 className="text-lg font-heading text-foreground">156</h5>
          <p className="text-sm text-text-secondary font-caption">Likes Received</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-soft text-center">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
            <Icon name="Users" size={20} color="white" />
          </div>
          <h5 className="text-lg font-heading text-foreground">12</h5>
          <p className="text-sm text-text-secondary font-caption">Friends Made</p>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;
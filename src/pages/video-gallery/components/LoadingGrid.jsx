import React from 'react';

const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8">
      {[...Array(8)]?.map((_, index) => (
        <div
          key={index}
          className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft animate-pulse"
        >
          {/* Thumbnail Skeleton */}
          <div className="aspect-video bg-muted relative">
            <div className="absolute bottom-2 right-2 bg-muted-foreground/20 rounded-lg w-12 h-6" />
            <div className="absolute top-2 left-2 bg-muted-foreground/20 rounded-lg w-16 h-6" />
          </div>

          {/* Content Skeleton */}
          <div className="p-4">
            {/* Title */}
            <div className="bg-muted h-6 rounded-lg mb-2" />
            <div className="bg-muted h-4 rounded-lg w-3/4 mb-3" />

            {/* Stats */}
            <div className="flex justify-between mb-3">
              <div className="bg-muted h-4 rounded-lg w-20" />
              <div className="bg-muted h-4 rounded-lg w-16" />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <div className="bg-muted h-8 rounded-lg flex-1" />
              <div className="bg-muted h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingGrid;
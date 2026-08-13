import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="glass-card p-4 animate-pulse-glow mb-4">
      <div className="d-flex justify-content-between mb-3">
        <div style={{ width: '40%', height: '20px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }}></div>
        <div style={{ width: '20%', height: '20px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px' }}></div>
      </div>
      <div style={{ width: '80%', height: '14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', marginBottom: '1rem' }}></div>
      <div className="progress-bar-bg mb-3">
        <div className="progress-bar-fill" style={{ width: '60%', opacity: 0.5 }}></div>
      </div>
      <div className="d-flex gap-2">
        <div style={{ width: '60px', height: '24px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px' }}></div>
        <div style={{ width: '80px', height: '24px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px' }}></div>
      </div>
    </div>
  );
};

export const SkeletonDashboard = () => {
  return (
    <div className="d-flex flex-column gap-4">
      <div className="grid-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonCard />
    </div>
  );
};

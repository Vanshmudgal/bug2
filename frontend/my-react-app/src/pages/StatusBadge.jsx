import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-emerald-900/20 text-emerald-400';
      case 'in-progress': return 'bg-amber-900/20 text-amber-400';
      case 'pending-approval': return 'bg-blue-900/20 text-blue-400';
      case 'closed': return 'bg-gray-800/50 text-gray-400';
      default: return '';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

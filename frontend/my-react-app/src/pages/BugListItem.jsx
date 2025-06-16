import React from 'react';
import StatusBadge from './StatusBadge';
import TimeTracking from './TimeTracking';

const BugListItem = ({ 
  bug, 
  user, 
  setEditingBug, 
  handleDeleteBug, 
  handleCloseBug, 
  handleApproveBug, 
  handleReopenBug 
}) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low': return 'text-gray-400';
      case 'medium': return 'text-blue-400';
      case 'high': return 'text-amber-400';
      case 'critical': return 'text-red-400';
      default: return '';
    }
  };

  return (
    <tr key={bug.id} className="hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{bug.title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{bug.project}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <StatusBadge status={bug.status} />
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm capitalize ${getPriorityColor(bug.priority)}`}>
        {bug.priority}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{bug.assignee || 'Unassigned'}</td>
      {user.role === 'manager' && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{bug.createdBy}</td>
      )}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
        <TimeTracking bug={bug} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 space-x-2">
        {user.role === 'developer' && (
          <>
            <button
              onClick={() => setEditingBug(bug)}
              className="text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteBug(bug.id)}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
            {bug.status === 'in-progress' && (
              <button
                onClick={() => handleCloseBug(bug.id)}
                className="text-amber-400 hover:text-amber-300"
              >
                End Task
              </button>
            )}
          </>
        )}
        {user.role === 'manager' && bug.status === 'pending-approval' && (
          <>
            <button
              onClick={() => handleApproveBug(bug.id)}
              className="text-emerald-400 hover:text-emerald-300"
            >
              Approve
            </button>
            <button
              onClick={() => handleReopenBug(bug.id)}
              className="text-amber-400 hover:text-amber-300"
            >
              Reopen
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default BugListItem;

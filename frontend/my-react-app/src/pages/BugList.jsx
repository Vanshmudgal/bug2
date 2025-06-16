import React from 'react';
import BugListItem from './BugListItem';

const BugList = ({ 
  filteredBugs, 
  user, 
  setEditingBug, 
  handleDeleteBug, 
  handleCloseBug, 
  handleApproveBug, 
  handleReopenBug 
}) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-lg font-medium text-gray-300">
          {user.role === 'developer' ? 'Your Bugs' : 'All Bugs'}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assignee</th>
              {user.role === 'manager' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created By</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {filteredBugs
              .filter(bug => user.role === 'manager' || bug.createdBy === user.name || bug.assignee === user.name)
              .map(bug => (
                <BugListItem 
                  key={bug.id} 
                  bug={bug} 
                  user={user} 
                  setEditingBug={setEditingBug}
                  handleDeleteBug={handleDeleteBug}
                  handleCloseBug={handleCloseBug}
                  handleApproveBug={handleApproveBug}
                  handleReopenBug={handleReopenBug}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BugList;

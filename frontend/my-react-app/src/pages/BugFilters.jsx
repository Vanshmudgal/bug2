import React from 'react';

const BugFilters = ({ filters, projects, handleFilterChange }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
      <h2 className="text-lg font-medium text-gray-300 mb-3">Filters</h2>
      <div className="flex flex-wrap gap-4">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="pending-approval">Pending Approval</option>
          <option value="closed">Closed</option>
        </select>
        
        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <select
          name="project"
          value={filters.project}
          onChange={handleFilterChange}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Projects</option>
          {projects.map(project => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BugFilters;

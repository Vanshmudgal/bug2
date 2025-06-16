import React from 'react';

const BugForm = ({ 
  newBug, 
  projects, 
  teamMembers, 
  handleInputChange, 
  handleLabelToggle, 
  handleAddBug 
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
      <h2 className="text-lg font-medium text-gray-300 mb-4">Create New Bug</h2>
      <form onSubmit={handleAddBug} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Title*</label>
            <input
              type="text"
              name="title"
              value={newBug.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Project*</label>
            <select
              name="project"
              value={newBug.project}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Description*</label>
          <textarea
            name="description"
            value={newBug.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Priority*</label>
            <select
              name="priority"
              value={newBug.priority}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status*</label>
            <select
              name="status"
              value={newBug.status}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Assignee</label>
            <select
              name="assignee"
              value={newBug.assignee}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Unassigned</option>
              {teamMembers.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={newBug.dueDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Labels</label>
          <div className="flex flex-wrap gap-2">
            {['bug', 'feature', 'ui', 'backend', 'urgent'].map(label => (
              <button
                key={label}
                type="button"
                onClick={() => handleLabelToggle(label)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  newBug.labels.includes(label) 
                    ? 'bg-blue-900/50 text-blue-400 border border-blue-800' 
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm font-medium transition-colors"
        >
          Create Bug
        </button>
      </form>
    </div>
  );
};

export default BugForm;

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

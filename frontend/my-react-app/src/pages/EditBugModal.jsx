import React from 'react';

const EditBugModal = ({ 
  editingBug, 
  setEditingBug, 
  projects, 
  handleUpdateBug 
}) => {
  if (!editingBug) return null;

  return (
    <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-800">
        <h2 className="text-lg font-medium text-gray-300 mb-4">Edit Bug</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={editingBug.title}
                onChange={(e) => setEditingBug({...editingBug, title: e.target.value})}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Project*</label>
              <select
                name="project"
                value={editingBug.project}
                onChange={(e) => setEditingBug({...editingBug, project: e.target.value})}
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
              value={editingBug.description}
              onChange={(e) => setEditingBug({...editingBug, description: e.target.value})}
              required
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Priority*</label>
              <select
                name="priority"
                value={editingBug.priority}
                onChange={(e) => setEditingBug({...editingBug, priority: e.target.value})}
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
                value={editingBug.status}
                onChange={(e) => setEditingBug({...editingBug, status: e.target.value})}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                {editingBug.status === 'pending-approval' && (
                  <option value="pending-approval">Pending Approval</option>
                )}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setEditingBug(null)}
              className="px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateBug}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBugModal;
